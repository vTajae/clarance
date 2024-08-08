import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface RelationshipInfo {
  _id: number;
  currentStatus: Field<
    | "Never Entered"
    | "Currently In"
    | "Separated"
    | "Annulled"
    | "Divorced"
    | "Widowed"
  >;
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
  notApplicable_SSN: Field<"YES" | "NO">;
  notApplicable_OtherNames: Field<"YES" | "NO">;
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
  estimated: Field<"YES" | "NO">;
}

interface Citizenship {
  _id: number;
  country: Field<string>;
}

interface Documentation {
  type:
    Field< "FS240Or545"
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
    | "Other">;
  documentNumber?: Field<string>;
  documentExpirationDate?: DateInfo;
  otherExplanation?: Field<string>; // Optional, if type is 'Other'
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
