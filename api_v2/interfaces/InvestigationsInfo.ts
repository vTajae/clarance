interface InvestigationsInfo {
  _id: number;
  governmentInvestigated: boolean; // (If NO, proceed to 25.2)
  revocation: boolean; // (If NO, proceed to 25.3)
  debarred: boolean;
  section25_1?: Section25_1[];
  section25_2?: Section25_2[];
  section25_3?: Section25_3[];
}

interface InvestigatingAgency {
  _id: number;
  agency:
    | "U.S. Department of Defense"
    | "U.S. Department of State"
    | "U.S. Office of Personnel Management"
    | "Federal Bureau of Investigation"
    | "U.S. Department of Treasury"
    | "U.S. Department of Homeland Security"
    | "Foreign government"
    | "I don't know"
    | "Other";
  explanation?: string;
}

interface LevelOfClearance {
  _id: number;
  level:
    | "None"
    | "Confidential"
    | "Secret"
    | "Top Secret"
    | "Sensitive Compartmented Information (SCI)"
    | "Q"
    | "L"
    | "I don't know"
    | "Other"
    | "Issued by foreign country";
  explanation?: string;
}

interface Section25_1 {
  investigatingAgency: InvestigatingAgency[];
  otherAgency: string;
  issuedAgency: string;
  investigationCompletionDate: string;
  clearanceEligibilityDate: string;
  levelOfClearance: LevelOfClearance[];
}

interface Section25_2 {
  denialDate: string;
  agency: string;
  explanation: string;
}

interface Section25_3 {
  debarmentDate: string;
  agency: string;
  explanation: string;
}


export type { InvestigatingAgency, Section25_1, Section25_2, Section25_3, InvestigationsInfo, LevelOfClearance }