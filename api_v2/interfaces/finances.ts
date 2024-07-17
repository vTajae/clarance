interface Finances {
  _id: number;
  filedBankruptcy: boolean; // (If NO, proceed to 26.2)
  gamblingProblem: boolean; // (If NO, proceed to 26.3)
  missedTaxes: boolean; // (If NO, proceed to 26.4)
  companyViolation: boolean; // (If NO, proceed to 26.5)
  counseling: boolean; // (If NO, proceed to 26.6)
  delinquent: boolean; // (If NO, proceed to 26.7)
  reposessions: boolean;
  section26_1?: Section26_1[];
  section26_2?: Section26_2[];
  section26_3?: Section26_3[];
  section26_4?: Section26_4[];
  section26_5?: Section26_5[];
  section26_6?: Section26_6[];
  section26_7?: Section26_7[];
}

interface DateInfo {
  date: string;
  estimated: boolean;
}

interface DateRange {
  from: DateInfo;
  to: DateInfo;
  present: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Section26_1 {
  bankruptcyPetitionType: BankruptcyPetitionType[];
  courtDocketNumber: string;
  dateFiled: DateInfo;
  dateDischarged: DateInfo;
  amountInvolved: AmountInvolved;
  debtRecordedUnder: NameInfo;
  courtName: string;
  courtAddress: Address;
  chapter13Details?: Chapter13Details;
  dischargedOfAllDebts: boolean;
  dischargeExplanation: string;
}

interface BankruptcyPetitionType {
  _id: number;
  type: "Chapter 7" | "Chapter 11" | "Chapter 12" | "Chapter 13";
}

interface AmountInvolved {
  amount: number;
  estimated: boolean;
}

interface NameInfo {
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
}

interface Chapter13Details {
  trusteeName: string;
  trusteeAddress: Address;
}

interface Section26_2 {
  financialProblemsDueToGambling: boolean;
  dateRange: DateRange;
  gamblingLosses: AmountInvolved;
  descriptionOfFinancialProblems: string;
  actionsTaken: string;
}

interface Section26_3 {
  failedToFileOrPay: FailureToFileOrPay[];
  yearFailed: DateInfo;
  failureReason: string;
  agencyName: string;
  taxType: string;
  amount: AmountInvolved;
  dateSatisfied: DateInfo;
  actionsTaken: string;
}

interface FailureToFileOrPay {
  _id: number;
  type: "File" | "Pay" | "Both";
}

interface Section26_4 {
  agencyOrCompanyName: string;
  agencyOrCompanyAddress: Address;
  counselingWarningDisciplinaryDate: DateInfo;
  counselingWarningDisciplinaryReason: string;
  violationAmount: AmountInvolved;
  rectifyingActions: string;
}

interface Section26_5 {
  explanation: string;
  creditCounselingOrganizationName: string;
  creditCounselingOrganizationPhoneNumber: PhoneNumber;
  creditCounselingOrganizationLocation: Address;
  counselingActions: string;
}

interface PhoneNumber {
  number: string;
  extension?: string;
  isInternationalOrDSN: boolean;
  timeOfDay: "Day" | "Night";
}

interface Section26_6 {
  agencyName: string;
  doesInclude: boolean;
  financialIssueTypes: FinancialIssueType[];
  loanAccountNumbers: string;
  propertyInvolved: string;
  amount: AmountInvolved;
  issueReason: string;
  currentStatus: string;
  issueDate: DateInfo;
  resolutionDate: DateInfo;
  courtName: string;
  courtAddress: Address;
  actionsTaken: string;
}

interface FinancialIssueType {
  _id: number;
  type:
    | "Delinquent on alimony or child support payments"
    | "Judgment entered against you"
    | "Lien placed against your property"
    | "Currently delinquent on any Federal debt";
}

interface Section26_7 {
  agencyName: string;
  doesInclude: boolean;
  financialIssueTypes: ExtendedFinancialIssueType[];
  loanAccountNumbers: string;
  propertyInvolved: string;
  amount: AmountInvolved;
  issueReason: string;
  currentStatus: string;
  issueDate: DateInfo;
  resolutionDate: DateInfo;
  courtName: string;
  courtAddress: Address;
  actionsTaken: string;
}

interface ExtendedFinancialIssueType {
  _id: number;
  type:
    | "Repossessed or foreclosed property"
    | "Defaulted on any loan"
    | "Bills or debts turned over to collection agency"
    | "Account or credit card suspended, charged off, or cancelled"
    | "Evicted for non-payment"
    | "Wages, benefits, or assets garnished or attached"
    | "Over 120 days delinquent on any debt not previously entered"
    | "Currently over 120 days delinquent on any debt";
}

export type {
  Finances,
  Section26_1,
  Section26_2,
  Section26_3,
  Section26_4,
  Section26_5,
  Section26_6,
  Section26_7,
  DateInfo,
  DateRange,
  Address,
  BankruptcyPetitionType,
  AmountInvolved,
  NameInfo,
  Chapter13Details,
  FailureToFileOrPay,
  FinancialIssueType,
  ExtendedFinancialIssueType,
  PhoneNumber,
};
