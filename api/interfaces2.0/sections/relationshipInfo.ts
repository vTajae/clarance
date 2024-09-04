import { Field } from "../formDefinition";

interface RelationshipInfo {
  _id: number;
  neverEntered: Field<"Yes"| "No">;
  currentlyIn: Field<"Yes"| "No">;
  separated: Field<"Yes"| "No">;
  annulled: Field<"Yes"| "No">;
  divorcedDissolved: Field<"Yes"| "No">;
  widowed: Field<"Yes"| "No">;
  section17_1?: Section17_1;
  section17_2?: Section17_2[];
  section17_3?: Section17_3;
}

interface Section17_1 {
  _id:number;
  fullName: Name;
  placeOfBirth: Location;
  dateOfBirth: DateInfo;
  citizenship: Citizenship[];
  documentation: Documentation;
  NA_SSN: Field<"Yes" | "No">;
  NA_OtherNames: Field<"Yes" | "No">;
  usSocialSecurityNumber?: Field<string>;
  otherNames?: OtherName[];
  relationshipStatus?: Field<"Divorced" | "Widowed" | "Annulled">; // For divorced, annulled, or widowed
  statusDetails?: StatusDetails; // For status-related details
}

interface Section17_2 {
  _id: number;
  marriageStatus: Field<string>;
  dateOfMarriage: DateInfo;
  placeOfMarriage: Location;
  spouseName: Name;
  spousePlaceOfBirth: Location;
  spouseDateOfBirth: DateInfo;
  spouseCitizenship: Citizenship[];
  spouseDocumentation: Documentation;
  spouseUsSocialSecurityNumber?: Field<string>;
  spouseOtherNames: OtherName[];
}

interface Section17_3 {
  _id: number;
  hasCohabitant: Field<"YES" | "NO">;
  cohabitants?: CohabitantDetails[];
}

interface Name {
  lastName: Field<string>;
  firstName: Field<string>;
  middleName?: Field<string>; // Optional
  suffix?: Field<string>; // Optional
}

interface Location {
  city: Field<string>;
  county?: Field<string>; // Optional
  state?: Field<string>; // Optional
  country: Field<string>;
}

interface DateInfo {
  date: Field<string>; // Assuming format 'MM/DD/YYYY'
  estimated: Field<"Yes" | "No">;
}

interface Citizenship {
  _id: number;
  country: Field<string>;
}

interface Documentation {
  FS240Or545?: Field<"Yes" | "No">;
  DS1350?: Field<"Yes" | "No">;
  AlienRegistration?: Field<"Yes" | "No">;
  PermanentResidentCard?: Field<"Yes" | "No">;
  CertificateOfNaturalization?: Field<"Yes" | "No">;
  CertificateOfCitizenship?: Field<"Yes" | "No">;
  I551?: Field<"Yes" | "No">;
  I766?: Field<"Yes" | "No">;
  I94?: Field<"Yes" | "No">;
  USVisa?: Field<"Yes" | "No">;
  I20?: Field<"Yes" | "No">;
  DS2019?: Field<"Yes" | "No">;
  Other?: {
    value: Field<"Yes" | "No">;
    explanation: Field<string>; // Explanation for "Other"
  };
  documentNumber: Field<string>;
  documentExpirationDate: DateInfo;
}


interface OtherName {
  _id: number;
  lastName: Field<string>;
  firstName: Field<string>;
  middleName?: Field<string>; // Optional
  suffix?: Field<string>; // Optional
  maidenName: Field<"YES" | "NO">;
  fromDate: DateInfo;
  toDate: DateInfo | null; // null if still applicable
}

interface StatusDetails {
  location: Location;
  date: DateInfo;
  recordLocation: Location;
  deceased?: Field<"YES" | "NO">;
  lastKnownAddress?: Address; // Optional, if person is deceased
}

interface Address {
  street: Field<string>;
  city: Field<string>;
  state?: Field<string>; // Optional
  zipCode?: Field<string>; // Optional
  country: Field<string>;
}

interface CohabitantDetails {
  _id: number;
  fullName: Name;
  placeOfBirth: Location;
  dateOfBirth: DateInfo;
  citizenship: Citizenship[];
  documentation: Documentation;
  usSocialSecurityNumber?: Field<string>;
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
