import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface EmploymentInfo {
  _id: number;
  employmentActivity: EmploymentActivity;
  otherExplanation?: Field<string>;
  section13A1?: Section13A1;
  section13A2?: Section13A2;
  section13A3?: Section13A3;
  section13A4?: Section13A4;
  section13A5?: Section13A5;
  section13A6?: Section13A6;
  section13B: Section13B;
  section13C: Section13C;
}

interface DateInfo {
  date: Field<string>;
  estimated: Field<"YES" | "NO">;
}

interface EmploymentEntry {
  _id: number;
  fromDate: Field<string>;
  toDate: Field<string>;
  present: Field<"YES" | "NO">;
  estimated: Field<"YES" | "NO">;
  agencyName: Field<string>;
  positionTitle: Field<string>;
  location: Address;
}

interface Section13B {
  hasFormerFederalEmployment: Field<"YES" | "NO">;
  employmentEntries: EmploymentEntry[];
}

interface EmploymentRecord {
  fired: Field<"YES" | "NO">;
  quitAfterToldWouldBeFired: Field<"YES" | "NO">;
  leftByMutualAgreementMisconduct: Field<"YES" | "NO">;
  leftByMutualAgreementPerformance: Field<"YES" | "NO">;
  writtenWarning: Field<"YES" | "NO">;
}

interface Section13C {
  employmentRecordIssues: Field<"YES" | "NO">;
  employmentRecord: EmploymentRecord;
}

type EmploymentActivity = Field<
  | "Active military duty station (Complete 13A.1, 13A.5 and 13A.6)"
  | "  National Guard/Reserve (Complete 13A.1, 13A.5 and 13A.6)"
  | "USPHS Commissioned Corps (Complete 13A.1, 13A.5 and 13A.6)"
  | "  Other Federal employment (Complete 13A.2, 13A.5 and 13A.6)"
  | "State Government (Non-Federal employment) (Complete 13A.2, 13A.5 and 13A.6) | Self-employment (Complete 13A.3, 13A.5 and 13A.6)"
  | " Unemployment (Complete 13A.4) Federal Contractor (Complete 13A.2, 13A.5 and 13A.6)"
  | "Non-government employment (excluding selfemployment) (Complete 13A.2, 13A.5 and 13A.6)"
  | "Other (Provide explanation and complete 13A.2, 13A.5 and 13A.6)"
>;

interface Section13A1 {
  fromDate: DateInfo;
  toDate: DateInfo;
  present: Field<"YES" | "NO">;
  employmentStatus: EmploymentStatus;
  dutyStation: Field<string>;
  rankOrPosition: Field<string>;
  address: Address;
  telephone: Telephone;
  apoFpoAddress: ApoFpoAddress;
  supervisor: Supervisor;
}

interface Section13A2 {
  fromDate: DateInfo;
  toDate: DateInfo;
  present: Field<"YES" | "NO">;
  employmentStatus: EmploymentStatus;
  positionTitle: Field<string>;
  employerName: Field<string>;
  employerAddress: Address;
  telephone: Telephone;
  additionalPeriods: AdditionalPeriod[];
  physicalWorkAddress: PhysicalWorkAddress;
}

interface Section13A3 {
  fromDate: DateInfo;
  toDate: DateInfo;
  present: Field<"YES" | "NO">;
  employmentStatus: EmploymentStatus;
  positionTitle: Field<string>;
  employmentName: Field<string>;
  employmentAddress: Address;
  telephone: Telephone;
  physicalWorkAddress: PhysicalWorkAddress;
  apoFpoAddress: ApoFpoAddress;
  selfEmploymentVerifier: SelfEmploymentVerifier;
}

interface Section13A4 {
  fromDate: DateInfo;
  toDate: DateInfo;
  present: Field<"YES" | "NO">;
  verifier: Verifier;
}

interface Section13A5 {
  reasonForLeaving: Field<string>;
  incidentInLastSevenYears: Field<"YES" | "NO">;
  incidentDetails?: IncidentDetails[];
}

interface Section13A6 {
  warnedInLastSevenYears: Field<"YES" | "NO">;
  warningDetails?: WarningDetails[];
}

interface IncidentDetails {
  type: IncidentType;
  reason: Field<string>;
  departureDate: Field<string>;
  estimated: Field<"YES" | "NO">;
}

interface WarningDetails {
  reason: Field<string>;
  date: DateInfo;
}

type IncidentType = Field<
  | "fired"
  | "quit"
  | "mutualAgreementMisconduct"
  | "mutualAgreementUnsatisfactory"
>;

interface AdditionalPeriod {
  _id: number;
  fromDate: DateInfo;
  toDate: DateInfo;
  present: Field<"YES" | "NO">;
  positionTitle: Field<string>;
  supervisor: Field<string>;
}

interface PhysicalWorkAddress {
  differentThanEmployer: Field<"YES" | "NO">;
  address: Address;
  telephone: Telephone;
}

interface SelfEmploymentVerifier {
  lastName: Field<string>;
  firstName: Field<string>;
  address: Address;
  telephone: Telephone;
  apoFpoAddress: ApoFpoAddress;
}

interface Verifier {
  hasApoAddress: Field<"YES" | "NO">;
  apoFpoAddress: ApoFpoAddress;
  lastName: Field<string>;
  firstName: Field<string>;
  address: Address;
  telephone: Telephone;
}

interface EmploymentStatus {
  fullTime: Field<"YES" | "NO">;
  partTime: Field<"YES" | "NO">;
}

interface Address {
  street: Field<string>;
  city: Field<string>;
  state: Field<string>;
  zipCode: Field<string>;
  country: Field<string>;
}

interface Telephone {
  number: Field<string>;
  extension?: Field<string>;
  internationalOrDsn: Field<"YES" | "NO">;
  day: Field<"YES" | "NO">;
  night: Field<"YES" | "NO">;
}

interface ApoFpoAddress {
  dutyLocation: Address;
  physicalWorkLocation: Address;
  apoOrFpo: Field<string>;
  apoFpoStateCode: Field<string>;
}

interface Supervisor {
  name: Field<string>;
  rankOrPosition: Field<string>;
  email: Field<string>;
  emailUnknown: Field<"YES" | "NO">;
  phone: Telephone;
  physicalWorkLocation: Address;
}

export type {
  IncidentDetails,
  AdditionalPeriod,
  Address,
  Supervisor,
  ApoFpoAddress,
  Telephone,
  Verifier,
  EmploymentStatus,
  SelfEmploymentVerifier,
  PhysicalWorkAddress,
  WarningDetails,
  EmploymentInfo,
  IncidentType,
  Section13A1,
  Section13A2,
  Section13A3,
  Section13A4,
  Section13A5,
  Section13A6,
  Section13B,
  Section13C,
};
