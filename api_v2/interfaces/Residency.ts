interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  hasAPOOrFPO: boolean;
}

interface APOOrFPODetails {
  addressUnitOrDutyLocation?: string;
  cityOrPostName?: string;
  state?: string;
  zip?: string;
  country?: string;
  hadAPOFPOAddress: boolean;
  APOFPOAddress?: string;
  APOOrFPO?: "APO" | "FPO";
  APOFPOStateCode?: string;
  APOFPOZip?: string;
}

interface Phone {
  phoneId: number;
  type: "Evening" | "Daytime" | "Cell/mobile";
  knowsNumber: boolean;
  isInternationalOrDSN: boolean;
  number?: string;
  extension?: string;
}

interface ContactAddress extends Address {
  APOOrFPODetails?: APOOrFPODetails;
}

interface Contact {
  lastname: string;
  firstname: string;
  middlename?: string;
  suffix?: string;
  lastContactDate: string;
  isLastContactEst: boolean;
  relationship: "Neighbor" | "Friend" | "Landlord" | "Business associate" | "Other";
  relationshipOtherDetail?: string;
  phone: Phone[];
  email?: string;
  contactAddress?: ContactAddress;
}

interface ResidenceAddress extends Address {
  APOOrFPODetails?: APOOrFPODetails;
}

interface ApplicantResidency {
  _id: number;
  residenceStartDate: string;
  isStartDateEst: boolean;
  residenceEndDate: string;
  isResidenceEndEst: boolean;
  isResidencePresent: boolean;
  residenceStatus: "Owned" | "Rented" | "Military housing" | "Other";
  residenceOtherDetails?: string;
  residenceAddress: ResidenceAddress;
  contact: Contact;
}




  export type { Address, APOOrFPODetails, Phone, ContactAddress, Contact, ResidenceAddress, ApplicantResidency };