interface RelationshipInfo {
  _id: number;
  currentStatus:
    | "NeverEntered"
    | "CurrentlyIn"
    | "Separated"
    | "Annulled"
    | "Divorced"
    | "Widowed";
  section17_1?: Section17_1;
  section17_2?: Section17_2[];
  section17_3?: Section17_3;
}

interface Section17_1 {
  _id: number;
  fullName: Name;
  placeOfBirth: Location;
  dateOfBirth: DateInfo;
  citizenship: Citizenship[];
  documentation: Documentation;
  usSocialSecurityNumber?: string;
  otherNames: OtherName[];
  relationshipStatus?: "Divorced" | "Widowed" | "Annulled"; // For divorced, annulled, or widowed
  statusDetails?: StatusDetails; // For status-related details
}

interface Section17_2 {
  _id: number;
  marriageStatus: string;
  dateOfMarriage: DateInfo;
  placeOfMarriage: Location;
  spouseName: Name;
  spousePlaceOfBirth: Location;
  spouseDateOfBirth: DateInfo;
  spouseCitizenship: Citizenship[];
  spouseDocumentation: Documentation;
  spouseUsSocialSecurityNumber?: string;
  spouseOtherNames: OtherName[];
}

interface Section17_3 {
  _id: number;
  hasCohabitant: boolean;
  cohabitants: CohabitantDetails[];
}

interface Name {
  lastName: string;
  firstName: string;
  middleName?: string; // Optional
  suffix?: string; // Optional
}

interface Location {
  city: string;
  county?: string; // Optional
  state?: string; // Optional
  country: string;
}

interface DateInfo {
  date: string; // Assuming format 'MM/DD/YYYY'
  estimated: boolean;
}

interface Citizenship {
  _id: number;
  country: string;
}

interface Documentation {
  type:
    | "FS240Or545"
    | "DS1350"
    | "AlienRegistration"
    | "PermanentResidentCard"
    | "CertificateOfNaturalization"
    | "CertificateOfCitizenship"
    | "I551"
    | "I766"
    | "I94"
    | "USVisa"
    | "I20"
    | "DS2019"
    | "Other";
  documentNumber?: string;
  documentExpirationDate?: DateInfo;
  otherExplanation?: string; // Optional, if type is 'Other'
}

interface OtherName {
  _id: number;
  lastName: string;
  firstName: string;
  middleName?: string; // Optional
  suffix?: string; // Optional
  maidenName: boolean;
  fromDate: DateInfo;
  toDate: DateInfo | null; // null if still applicable
}

interface StatusDetails {
  location: Location;
  date: DateInfo;
  recordLocation: Location;
  deceased?: boolean;
  lastKnownAddress?: Address; // Optional, if person is deceased
}

interface Address {
  street: string;
  city: string;
  state?: string; // Optional
  zipCode?: string; // Optional
  country: string;
}

interface CohabitantDetails {
  _id: number;
  fullName: Name;
  placeOfBirth: Location;
  dateOfBirth: DateInfo;
  citizenship: Citizenship[];
  documentation: Documentation;
  usSocialSecurityNumber?: string;
  otherNames: OtherName[];
  cohabitationStartDate: DateInfo;
}

export type {
  StatusDetails,
  RelationshipInfo,
  Section17_1,
  Section17_2,
  Section17_3,
  OtherName,
  Location,
  Name,
  Documentation,
  DateInfo,
  CohabitantDetails,
  Citizenship,
};
