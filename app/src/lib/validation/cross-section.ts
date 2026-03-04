/**
 * Cross-section consistency validation.
 *
 * Some SF-86 answers must be consistent across sections.
 * For example, if you claim US citizenship in Section 9,
 * you shouldn't have "dual citizenship" entries in Section 10.
 */

type FieldValues = Record<string, unknown>;

interface CrossSectionIssue {
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
