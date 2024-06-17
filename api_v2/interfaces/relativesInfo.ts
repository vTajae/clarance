interface RelativesInfo {
  _id: number;
  relativeTypes: RelativeCheckbox[];
  entries: RelativeEntry[];
}

interface RelativeCheckbox {
  _id: number;
  type: string;
}

interface RelativeEntry {
  _id: number;
  type: RelativeType;
  fullName: FullName;
  dateOfBirth: string; // Format: MM/DD/YYYY or "Est."
  placeOfBirth: PlaceOfBirth;
  countriesOfCitizenship: Countries[];
  isDeceased: boolean;
  isUSCitizen: boolean;
  hasForeignAddress: boolean;
  hasUSAddress: boolean;
  details: RelativeDetails;
}

interface Countries {
  _id: number;
  country: string;
}

interface FullName {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
}

interface PlaceOfBirth {
  city: string;
  state?: string;
  country: string;
}

interface RelativeDetails {
  section18_1?: Section18_1Details;
  section18_2?: Section18_2Details;
  section18_3?: Section18_3Details;
  section18_4?: Section18_4Details;
  section18_5?: Section18_5Details;
}

interface Section18_5Details {
  firstContactDate: string;
  lastContactDate?: string;  // Can be 'Present' or an estimated date
  contactMethods: ContactMethod[];
  contactFrequency: ContactFrequency;
  employerDetails: EmployerDetails;
  foreignGovernmentAffiliation?: ForeignGovernmentAffiliation;
}

type ContactMethod = 'InPerson' | 'Telephone' | 'WrittenCorrespondence' | 'Electronic' | 'Other';

interface ContactFrequency {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Other';
  explanation?: string; // Optional, used if 'Other' is selected
}

interface EmployerDetails {
  name: string;
  address?: Address; // Optional, in case the address is known and applicable
  unknown: boolean;  // Indicates if the employer's details are unknown
}

interface Address {
  street?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

interface ForeignGovernmentAffiliation {
  description: string;
}


interface Section18_4Details {
  usDocumentation: USDocumentation[];
  documentNumber: string;
  documentExpirationDate: string;
  firstContactDate: string;
  lastContactDate?: string;  // Optional, can be 'Present' or estimated
  contactMethods: ContactMethod[];
  contactFrequency: ContactFrequency; // Can be 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', or other specified
  currentEmployer?: EmployerDetails;
  recentEmployer?: EmployerDetails; // Optional, if different from current employer
  foreignGovernmentAffiliation?: ForeignGovernmentAffiliation;
}

interface USDocumentation {
  type: USDocumentationType;
}

type USDocumentationType =
  | "I551PermanentResident"
  | "I766EmploymentAuthorization"
  | "I94ArrivalDepartureRecord"
  | "I20CertificateEligibilityF1Student"
  | "DS2019CertificateEligibilityJ1Status"
  | "Other";


interface EmployerDetails {
  name: string;
  street?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

interface ForeignGovernmentAffiliation {
  description: string;
  relatedTo: string; // 'Government', 'Military', 'Security', 'DefenseIndustry', 'ForeignMovement', 'IntelligenceService'
}


interface Section18_3Details {
  citizenshipDocuments: CitizenshipDocument[];
  courtDetails?: CourtDetails;  // Optional: Only needed if Certificate of Naturalization is selected
}

interface CitizenshipDocument {
  type: CitizenshipDocumentType;
  documentNumber: string;
}

type CitizenshipDocumentType =
  | "FS240or545"   // Born Abroad to U.S. Parents: FS 240 or 545
  | "DS1350"       // Born Abroad to U.S. Parents: DS 1350
  | "AlienRegistrationNaturalized" // Naturalized: Alien Registration
  | "PermanentResidentCardI551Naturalized" // Naturalized: Permanent Resident Card (I-551)
  | "CertificateOfNaturalizationN550orN570" // Naturalized: Certificate of Naturalization (N550 or N570)
  | "AlienRegistrationDerived"  // Derived: Alien Registration
  | "PermanentResidentCardI551Derived" // Derived: Permanent Resident Card (I-551)
  | "CertificateOfCitizenshipN560orN561" // Derived: Certificate of Citizenship (N560 or N561)
  | "Other";     // Other documentation type

interface CourtDetails {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}


interface Section18_2Details {
  _id: number;
  street: string;
  city: string;
  state?: string;      // Optional since it might be outside the USA where states aren't applicable
  zipCode?: string;
  country: string;
  hasAPOFPOAddress: boolean;
  apofpoAddress?: APOFPOAddress;  // This is optional and dependent on the hasAPOFPOAddress being true
  dontKnowAPOFPO: boolean;
}

interface APOFPOAddress {
  address: string;
  apofpoStateCode: string;
  apofpoZipCode: string;
}


interface Section18_1Details {
  ifMother?: ParentInfo;
  hasOtherNames: boolean;
  otherNamesUsed: OtherNameEntry[];
}

interface ParentInfo {
  lastName: string;
  firstName: string;
  middleName: string;
  suffix?: string;
  sameAsListed: boolean;
  iDontKnow: boolean;
}

interface OtherNameEntry {
  _id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  maidenName: boolean;
  from?: string;  // Format: Month/Year
  to?: string;    // Format: Month/Year or 'Present'
  estimatedFrom?: boolean;
  estimatedTo?: boolean;
  reasonForChange?: string;
}




type RelativeType = "Mother" | "Foster Parent" | "Sister" | "Half-Sister" | "Father" | 
                    "Child" | "Stepbrother" | "Father-in-law" | "Stepmother" | "Stepchild" | 
                    "Stepsister" | "Mother-in-law" | "Stepfather" | "Brother" | "Half-Brother" |
                    "Guardian";


export type { CitizenshipDocumentType,USDocumentationType, ContactMethod, RelativesInfo,RelativeCheckbox,RelativeType, RelativeEntry, FullName, PlaceOfBirth, RelativeDetails, Section18_1Details, ParentInfo, OtherNameEntry, Section18_2Details, Section18_3Details, Section18_4Details, Section18_5Details };