interface RelativesInfo {
  _id: number;
  documentation?: Documentation; // Optional, if applicable
  otherNames: OtherName[];
  currentAddress?: Address; // Optional
  apoFpoAddress?: ApoFpoAddress; // Optional
  deceased: boolean | null; // null to represent unanswered state
  methodsOfContact?: MethodsOfContact; // Optional
  employerInfo?: EmployerInfo; // Optional
  foreignAffiliation?: ForeignAffiliation; // Optional
}

interface RelativesInfo {
  _id: number;
  relativeTypes: RelativeType[];
  relatives: Relative[];
  section17_1?: Section18_1[];
  section17_2?: Section18_2[];
  section17_3?: Section18_3;
}

interface Relative {
  _id: number;
  relativeTypes: RelativeType[];
  relatives: Relative[];
  relativeBasicInfo: RelativeBasicInfo[];
  section17_1?: Section18_1[];
  section17_2?: Section18_2[];
  section17_3?: Section18_3;
  section17_4?: Section18_4;
  section17_5?: Section18_5;

}


interface RelativeBasicInfo {
  _id: number;
  relativeType: RelativeType;
  fullName: Name;
  dateOfBirth: DateInfo;
  placeOfBirth: Location;
  citizenship: Citizenship[];

}

type RelativeType =
  | "Mother"
  | "Father"
  | "Stepmother"
  | "Stepfather"
  | "FosterParent"
  | "Child"
  | "Stepchild"
  | "Brother"
  | "Sister"
  | "Stepbrother"
  | "Stepsister"
  | "HalfBrother"
  | "HalfSister"
  | "FatherInLaw"
  | "MotherInLaw"
  | "Guardian";

interface Name {
  lastName: string;
  firstName: string;
  middleName?: string; // Optional
  suffix?: string; // Optional
}

interface DateInfo {
  date: string; // Assuming format 'MM/DD/YYYY'
  estimated: boolean;
}

interface Location {
  city: string;
  state?: string; // Optional
  country: string;
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
  reasonForChange?: string; // Optional
}

interface Address {
  street: string;
  city: string;
  state?: string; // Optional
  zipCode?: string; // Optional
  country: string;
}

interface ApoFpoAddress {
  address: string;
  stateCode: string;
  zipCode: string;
}

interface MethodsOfContact {
  inPerson: boolean;
  telephone: boolean;
  writtenCorrespondence: boolean;
  electronic: boolean;
  other?: string; // Optional
  frequencyOfContact: ContactFrequency;
}

type ContactFrequency =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Annually"
  | "Other";

interface EmployerInfo {
  employerName?: string;
  employerAddress?: Address;
  unknown: boolean;
}

interface ForeignAffiliation {
  affiliated: boolean;
  description?: string; // Optional, if affiliated
}

export type {
  RelativesInfo,
  Relative,
  Name,
  DateInfo,
  Location,
  Citizenship,
  Documentation,
  OtherName,
  Address,
  ApoFpoAddress,
  MethodsOfContact,
  ContactFrequency,
  EmployerInfo,
  ForeignAffiliation,
  RelativeType,
};
