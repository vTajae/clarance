interface EmploymentInfo {
  _id: number;
  employmentActivity: EmploymentActivity;
  otherExplanation?: string; 
  section13A1?: Section13A1[];
  section13A2?: Section13A2;
  section13A3?: Section13A3;
  section13A4?: Section13A4;
  section13A5?: Section13A5;
  section13A6?: Section13A6;
  section13B: Section13B;
  section13C: Section13C; 
}

interface EmploymentEntry {
  _id: number;
  fromDate: string;
  toDate: string;
  present: boolean;
  estimated: boolean;
  agencyName: string;
  positionTitle: string;
  location: Address;
}

interface Section13B {
  hasFormerFederalEmployment: boolean;
  employmentEntries: EmploymentEntry[];
}

interface EmploymentRecord {
  fired: boolean;
  quitAfterToldWouldBeFired: boolean;
  leftByMutualAgreementMisconduct: boolean;
  leftByMutualAgreementPerformance: boolean;
  writtenWarning: boolean;
}

interface Section13C {
  employmentRecordIssues: boolean;
  employmentRecord: EmploymentRecord;
}

type EmploymentActivity = 'activeMilitaryDutyStation' | 'nationalGuardReserve' | 'usphsCommissionedCorps' | 'otherFederalEmployment' | 'stateGovernment' | 'nonGovernmentEmployment' | 'selfEmployment'| 'unemployment' | 'federalContractor' | 'other' | 'none';


interface Section13A1 {
  fromDate: string;
  toDate: string;
  present: boolean;
  estimated: boolean;
  employmentStatus: EmploymentStatus;
  dutyStation: string;
  rankOrPosition: string;
  address: Address;
  telephone: Telephone;
  apoFpoAddress: ApoFpoAddress;
  supervisor: Supervisor;
}

interface Section13A2 {
  fromDate: string;
  toDate: string;
  present: boolean;
  estimated: boolean;
  employmentStatus: EmploymentStatus;
  positionTitle: string;
  employerName: string;
  employerAddress: Address;
  telephone: Telephone;
  additionalPeriods: AdditionalPeriod[];
  physicalWorkAddress: PhysicalWorkAddress;
}

interface Section13A3 {
  fromDate: string;
  toDate: string;
  present: boolean;
  estimated: boolean;
  employmentStatus: EmploymentStatus;
  positionTitle: string;
  employmentName: string;
  employmentAddress: Address;
  telephone: Telephone;
  physicalWorkAddress: PhysicalWorkAddress;
  apoFpoAddress: ApoFpoAddress;
  selfEmploymentVerifier: SelfEmploymentVerifier;
}

interface Section13A4 {
  fromDate: string;
  toDate: string;
  present: boolean;
  estimated: boolean;
  verifier: Verifier;
}

interface Section13A5 {
  reasonForLeaving: string;
  incidentInLastSevenYears: boolean;
  incidentDetails?: IncidentDetails[];
}

interface Section13A6 {
  warnedInLastSevenYears: boolean;
  warningDetails?: WarningDetails[];
}

interface IncidentDetails {
  type: IncidentType;
  reason: string;
  departureDate: string;
  estimated: boolean;
}

interface WarningDetails {
  reason: string;
  date: string;
  estimated: boolean;
}

type IncidentType = 'fired' | 'quit' | 'mutualAgreementMisconduct' | 'mutualAgreementUnsatisfactory';

interface AdditionalPeriod {
  _id: number;
  fromDate: string;
  toDate: string;
  estimatedFrom: boolean;
  estimatedTo: boolean;
  positionTitle: string;
  supervisor: string;
}

interface PhysicalWorkAddress {
  differentThanEmployer: boolean;
  address: Address;
  telephone: Telephone;
}

interface SelfEmploymentVerifier {
  lastName: string;
  firstName: string;
  address: Address;
  telephone: Telephone;
  apoFpoAddress: ApoFpoAddress;
}

interface Verifier {
  hasApoAddress: boolean;
  apoFpoAddress: ApoFpoAddress;
  lastName: string;
  firstName: string;
  address: Address;
  telephone: Telephone;
}

interface EmploymentStatus {
  fullTime: boolean;
  partTime: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Telephone {
  number: string;
  extension?: string;
  internationalOrDsn: boolean;
  day: boolean;
  night: boolean;
}

interface ApoFpoAddress {
  physicalLocationData: Address;
  physicalWorkLocation: Address;
  apoOrFpo: string;
  apoFpoStateCode: string;
}

interface Supervisor {
  name: string;
  rankOrPosition: string;
  email: string;
  emailUnknown: boolean;
  phone: Telephone;
  physicalWorkLocation: Address;
}

export type { IncidentDetails, AdditionalPeriod, Address, Supervisor, ApoFpoAddress, Telephone, Verifier, EmploymentStatus,SelfEmploymentVerifier,PhysicalWorkAddress,WarningDetails, EmploymentInfo,IncidentType, Section13A1, Section13A2, Section13A3, Section13A4, Section13A5, Section13A6, Section13B, Section13C };
