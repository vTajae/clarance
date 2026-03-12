/**
 * Cross-section consistency validation.
 *
 * Checks that span multiple sections of the SF-86:
 *  - Name consistency (Section 1 vs Section 30)
 *  - Age validation (Section 2)
 *  - Citizenship consistency (Section 9 vs Section 10)
 *  - PO Box rejection (Sections 11, 13A — physical addresses required)
 *  - Date order validation (start < end across all date-pair fields)
 *  - Reference exclusion (Section 16 vs Section 1/17/18)
 */

type FieldValues = Record<string, unknown>;

export interface CrossSectionIssue {
  severity: "error" | "warning";
  message: string;
  sections: string[];
  fields: string[];
}

/**
 * Run all cross-section consistency checks.
 */
export function validateCrossSections(
  allSectionData: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];

  issues.push(...checkNameConsistency(allSectionData));
  issues.push(...checkDateConsistency(allSectionData));
  issues.push(...checkCitizenshipConsistency(allSectionData));
  issues.push(...checkPOBoxAddresses(allSectionData));
  issues.push(...checkDateOrder(allSectionData));
  issues.push(...checkReferenceExclusion(allSectionData));

  return issues;
}

/**
 * Name used in Section 1 should match Section 30 (signature).
 *
 * Section 1 has separate first/middle name fields.
 * Section 30 has a single combined field: signature.fullNameTypeOrPrintLegibly.
 */
function checkNameConsistency(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const personal = data["section1"];
  const sig = data["section30"];

  if (!personal || !sig) return issues;

  const firstName = (personal["personalInfo.firstName"] as string) || "";
  const middleName = (personal["personalInfo.middleName"] as string) || "";
  const lastName = (personal["personalInfo.section1"] as string) || "";
  const personalName = [lastName, firstName, middleName].filter(Boolean).join(" ").trim();

  const sigName = (sig["signature.fullNameTypeOrPrintLegibly"] as string) || "";

  if (personalName && sigName && personalName.toLowerCase() !== sigName.toLowerCase()) {
    issues.push({
      severity: "warning",
      message: `Name in Section 1 ("${personalName}") differs from Signature ("${sigName}")`,
      sections: ["section1", "section30"],
      fields: [
        "personalInfo.section1",
        "personalInfo.firstName",
        "personalInfo.middleName",
        "signature.fullNameTypeOrPrintLegibly",
      ],
    });
  }

  return issues;
}

/**
 * Birth date in Section 2 shouldn't make applicant too young for the form.
 */
function checkDateConsistency(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const birth = data["section2"];

  if (!birth) return issues;

  const dob = birth["birthInfo.section2"] as string | undefined;
  if (!dob) return issues;

  const birthDate = new Date(dob);
  const now = new Date();
  const age = Math.floor(
    (now.getTime() - birthDate.getTime()) / (365.25 * 86_400_000)
  );

  if (age < 18) {
    issues.push({
      severity: "error",
      message: `Applicant appears to be ${age} years old. Must be at least 18.`,
      sections: ["section2"],
      fields: ["birthInfo.section2"],
    });
  }

  if (age > 100) {
    issues.push({
      severity: "warning",
      message: `Applicant appears to be ${age} years old. Please verify date of birth.`,
      sections: ["section2"],
      fields: ["birthInfo.section2"],
    });
  }

  return issues;
}

/**
 * Citizenship section should be consistent with dual citizenship.
 */
function checkCitizenshipConsistency(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const citizenship = data["section9"];
  const dual = data["section10"];

  if (!citizenship || !dual) return issues;

  const isUsCitizen = citizenship["citizenshipInfo.isUsCitizen"];
  const hasDual = dual["dualCitizenshipInfo.hasDualCitizenship"];

  if (isUsCitizen === false && hasDual === true) {
    issues.push({
      severity: "warning",
      message:
        "Dual citizenship is marked but US citizenship is not confirmed. Please verify.",
      sections: ["section9", "section10"],
      fields: [
        "citizenshipInfo.isUsCitizen",
        "dualCitizenshipInfo.hasDualCitizenship",
      ],
    });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// PO Box rejection (Sections 11, 13A)
// ---------------------------------------------------------------------------

const PO_BOX_RE = /\b(p\.?\s*o\.?\s*box|post\s*office\s*box)\b/i;

/**
 * SF-86 requires physical street addresses for residences and employers.
 * PO Boxes are not acceptable for primary addresses.
 */
function checkPOBoxAddresses(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const addressSections = ["section11", "section13A"];

  for (const section of addressSections) {
    const sectionData = data[section];
    if (!sectionData) continue;

    for (const [key, value] of Object.entries(sectionData)) {
      if (typeof value !== "string") continue;
      // Only check address/street fields
      const lower = key.toLowerCase();
      if (
        !lower.includes("street") &&
        !lower.includes("address") &&
        !lower.includes("mailing")
      ) continue;

      if (PO_BOX_RE.test(value)) {
        issues.push({
          severity: "error",
          message: `PO Box detected in ${section === "section11" ? "residence" : "employment"} address. A physical street address is required.`,
          sections: [section],
          fields: [key],
        });
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Date order validation (start date must precede end date)
// ---------------------------------------------------------------------------

/**
 * Scans all sections for date pairs (startDate/endDate, dateFrom/dateTo, etc.)
 * and validates that start precedes end.
 */
function checkDateOrder(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];

  // Match patterns: grouped by instance prefix (e.g. "residencyInfo.0")
  for (const [section, sectionData] of Object.entries(data)) {
    if (!sectionData) continue;

    // Group fields by their instance prefix (everything before the last segment)
    const instanceDates = new Map<
      string,
      { starts: Array<[string, string]>; ends: Array<[string, string]> }
    >();

    for (const [key, value] of Object.entries(sectionData)) {
      if (typeof value !== "string" || !value) continue;

      // Extract instance prefix: "residencyInfo.0.startDate" → "residencyInfo.0"
      const lastDot = key.lastIndexOf(".");
      if (lastDot < 0) continue;
      const prefix = key.substring(0, lastDot);
      const suffix = key.substring(lastDot + 1).toLowerCase();

      let entry = instanceDates.get(prefix);
      if (!entry) {
        entry = { starts: [], ends: [] };
        instanceDates.set(prefix, entry);
      }

      if (
        suffix.includes("startdate") ||
        suffix.includes("from_date") ||
        suffix.includes("fromdate") ||
        suffix.includes("datefrom")
      ) {
        entry.starts.push([key, value]);
      } else if (
        suffix.includes("enddate") ||
        suffix.includes("to_date") ||
        suffix.includes("todate") ||
        suffix.includes("dateto")
      ) {
        entry.ends.push([key, value]);
      }
    }

    // Check each instance group for start > end
    for (const [, { starts, ends }] of instanceDates) {
      for (const [startKey, startVal] of starts) {
        for (const [endKey, endVal] of ends) {
          const startDate = new Date(startVal);
          const endDate = new Date(endVal);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;

          if (startDate > endDate) {
            issues.push({
              severity: "error",
              message: `Start date (${startVal}) is after end date (${endVal}). Dates must be in chronological order.`,
              sections: [section],
              fields: [startKey, endKey],
            });
          }
        }
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Reference exclusion (Section 16)
// ---------------------------------------------------------------------------

/**
 * Section 16 references cannot be the applicant, their spouse, or
 * anyone listed as a relative in Section 18.
 */
function checkReferenceExclusion(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];

  const s1 = data["section1"];
  const s16 = data["section16"];
  const s17 = data["section17"];
  const s18 = data["section18"];

  if (!s16) return issues;

  // Collect applicant name
  const applicantNames = new Set<string>();
  if (s1) {
    const first = normalise(s1["personalInfo.firstName"] as string);
    const last = normalise(s1["personalInfo.section1"] as string);
    if (first && last) applicantNames.add(`${first} ${last}`);
  }

  // Collect spouse name from Section 17
  const spouseNames = new Set<string>();
  if (s17) {
    for (const [key, value] of Object.entries(s17)) {
      if (typeof value !== "string" || !value) continue;
      const lower = key.toLowerCase();
      if ((lower.includes("firstname") || lower.includes("lastname")) && lower.includes("spouse")) {
        // Collect individual parts
      }
    }
    // Try common spouse name patterns
    for (let i = 0; i < 3; i++) {
      const first = normalise(s17[`spouseInfo.${i}.firstName`] as string ?? s17[`maritalInfo.${i}.firstName`] as string);
      const last = normalise(s17[`spouseInfo.${i}.lastName`] as string ?? s17[`maritalInfo.${i}.lastName`] as string);
      if (first && last) spouseNames.add(`${first} ${last}`);
    }
  }

  // Collect relative names from Section 18
  const relativeNames = new Set<string>();
  if (s18) {
    for (let i = 0; i < 6; i++) {
      const keys = Object.keys(s18).filter(
        (k) => k.startsWith(`relativesInfo.${i}.`) && k.toLowerCase().includes("firstname")
      );
      for (const fk of keys) {
        const firstName = normalise(s18[fk] as string);
        // Find matching lastName
        const lk = fk.replace(/firstName/i, "lastName").replace(/firstname/i, "lastname");
        const lastName = normalise(s18[lk] as string);
        if (firstName && lastName) relativeNames.add(`${firstName} ${lastName}`);
      }
    }
  }

  // Check Section 16 reference names against exclusion list
  const excludedNames = new Set([...applicantNames, ...spouseNames, ...relativeNames]);
  if (excludedNames.size === 0) return issues;

  for (let i = 0; i < 3; i++) {
    // Try different naming patterns for the 3 references
    const suffixes = [`_${i + 3}`, `_${i}`]; // Section 16 uses _3, _4, _5 suffix pattern
    for (const suf of suffixes) {
      const firstName = normalise(s16[`peopleThatKnow.0.firstName${suf}`] as string);
      const lastName = normalise(s16[`peopleThatKnow.0.lastName${suf}`] as string
        ?? s16[`peopleThatKnow.0.section16${suf}`] as string);

      if (!firstName || !lastName) continue;

      const refName = `${firstName} ${lastName}`;

      if (applicantNames.has(refName)) {
        issues.push({
          severity: "error",
          message: `Reference ${i + 1} ("${refName}") matches the applicant's name. You cannot list yourself as a reference.`,
          sections: ["section16", "section1"],
          fields: [`peopleThatKnow.0.firstName${suf}`, `peopleThatKnow.0.lastName${suf}`],
        });
      } else if (spouseNames.has(refName)) {
        issues.push({
          severity: "error",
          message: `Reference ${i + 1} ("${refName}") matches your spouse. You cannot list your spouse as a reference.`,
          sections: ["section16", "section17"],
          fields: [`peopleThatKnow.0.firstName${suf}`, `peopleThatKnow.0.lastName${suf}`],
        });
      } else if (relativeNames.has(refName)) {
        issues.push({
          severity: "warning",
          message: `Reference ${i + 1} ("${refName}") matches a relative listed in Section 18. The SF-86 advises against listing relatives as references.`,
          sections: ["section16", "section18"],
          fields: [`peopleThatKnow.0.firstName${suf}`, `peopleThatKnow.0.lastName${suf}`],
        });
      }

      break; // Found a match for this reference slot, no need to try other suffixes
    }
  }

  return issues;
}

function normalise(s: string | undefined | null): string {
  return (s ?? "").trim().toLowerCase();
}
