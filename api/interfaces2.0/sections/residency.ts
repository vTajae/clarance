import { Field } from "api/interfaces2.0/formDefinition";


interface Address {
  street: Field<string>;
  city: Field<string>;
  state: Field<string>;
  zip: Field<string>;
  country: Field<string>;
  hasAPOOrFPO: Field<"YES " | "NO">; // KEEP THE SPACE FOR NOW
}

interface APOOrFPODetails {
  addressUnitOrDutyLocation?: Field<string>;
  cityOrPostName?: Field<string>;
  state?: Field<string>;
  zip?: Field<string>;
  country?: Field<string>;
  hadAPOFPOAddress: Field<"Yes" | "No">;
  APOFPOAddress?: Field<string>;
  APOOrFPO?: Field<"APO" | "FPO">;
  APOFPOStateCode?: Field<string>;
  APOFPOZip?: Field<string>;
}

interface Phone {
  _id: number;
  dontKnowNumber: Field<"Yes" | "No">;
  isInternationalOrDSN: Field<"Yes" | "No">;
  number?: Field<string>;
  extension?: Field<string>;
}

interface ContactAddress extends Address {
  APOOrFPODetails?: APOOrFPODetails;
}

interface Contact {
  lastname: Field<string>;
  firstname: Field<string>;
  middlename?: Field<string>;
  suffix?: Field<string>;
  lastContactDate: Field<string>;
  isLastContactEst: Field<"Yes" | "No">;
  relationship: RelationshipField;
  relationshipOtherDetail?: Field<string>;
  phone: Phone[];
  email?: Field<string>;
  dontKnowEmail: Field<"Yes" | "No">;
  contactAddress?: ContactAddress;
}

type CheckboxField = Field<"Yes" | "No">;

interface RelationshipField {
  checkboxes: CheckboxField[];
}

interface ResidenceAddress extends Address {
  APOOrFPODetails?: APOOrFPODetails;
}

interface ResidencyInfo {
  _id: number;
  residenceStartDate: Field<string>;
  isStartDateEst: Field<"Yes" | "No">;
  residenceEndDate: Field<string>;
  isResidenceEndEst: Field<"Yes" | "No">;
  isResidencePresent: Field<"Yes" | "No">;
  residenceStatus: Field<"1" | "2" | "3" | "4">;
  residenceOtherDetails?: Field<string>;
  residenceAddress: ResidenceAddress;
  contact: Contact;
}



//residency Status
// 1 Owned
// 2 Rented
// 3 Military housing 
// 4 Other


  export type { Address, APOOrFPODetails, Phone, ContactAddress, Contact, ResidenceAddress, ResidencyInfo };