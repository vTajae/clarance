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
 */
function checkNameConsistency(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const personal = data["section1"];
  const sig = data["section30"];

  if (!personal || !sig) return issues;

  const personalName =
    `${personal["personalInfo.firstName"] || ""} ${personal["personalInfo.lastName"] || ""}`.trim();
  const sigName =
    `${sig["signature.firstName"] || ""} ${sig["signature.lastName"] || ""}`.trim();

  if (personalName && sigName && personalName !== sigName) {
    issues.push({
      severity: "warning",
      message: `Name in Section 1 ("${personalName}") differs from Signature ("${sigName}")`,
      sections: ["section1", "section30"],
      fields: [
        "personalInfo.firstName",
        "personalInfo.lastName",
        "signature.firstName",
        "signature.lastName",
      ],
    });
  }

  return issues;
}

/**
 * Birth date in Section 3 shouldn't make applicant too young for the form.
 */
function checkDateConsistency(
  data: Record<string, FieldValues>
): CrossSectionIssue[] {
  const issues: CrossSectionIssue[] = [];
  const birth = data["section3"];

  if (!birth) return issues;

  const dob = birth["birthInfo.dateOfBirth"] as string | undefined;
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
      sections: ["section3"],
      fields: ["birthInfo.dateOfBirth"],
    });
  }

  if (age > 100) {
    issues.push({
      severity: "warning",
      message: `Applicant appears to be ${age} years old. Please verify date of birth.`,
      sections: ["section3"],
      fields: ["birthInfo.dateOfBirth"],
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
