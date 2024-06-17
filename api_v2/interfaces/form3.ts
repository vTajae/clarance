import { CitizenshipNaturalizationInfo } from "./Citizenship";
import { DualCitizenshipFormData } from "./DuelCitizenship";

interface ApplicantInfo {
  personalInfo: ApplicantPersonalInfo;
  names: ApplicantNames[];
  birthInfo: ApplicantBirthInfo;
  physicalAttributes: ApplicantPhysicalAttributes;
  contactInfo: ApplicantContactInfo;
  passportInfo: ApplicantPassportInfo;
  citizenshipInfo: CitizenshipNaturalizationInfo;
  duelCitizenshipInfo: DualCitizenshipFormData;
  documents?: ApplicantDocuments[];
  residencyInfo: ApplicantResidency[];
  contacts?: ApplicantContacts[];
}

interface ApplicantPersonalInfo {
  applicantID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  ssn: string;
  gender: string;
  isInternational: boolean;
}

interface ApplicantNames {
  nameID: number;
  applicantID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  nameStarted: Date | string;
  isStartDateEst: boolean;
  nameEnded: Date | string;
  isNamePresent: boolean;
  isEndDateEst: boolean;
  isMaidenName: boolean;
  reasonChanged: string;
}

interface ApplicantBirthInfo {
  birthInfoID: number;
  applicantID: number;
  birthDate: Date | string;
  isBirthDateEstimate: boolean;
  birthCity: string;
  birthState: string;
  birthCountry: string;
}

interface ApplicantPhysicalAttributes {
  attributeID: number;
  applicantID: number;
  heightFeet: number;
  heightInch: number;
  weight: number;
  hairColor: string;
  eyeColor: string;
}

interface ApplicantContactNumber {
  numberType: "Home" | "Work" | "Cell"; // Assuming these are the three types
  phoneNumber: string;
  phoneExtension: string;
  isUsableDay: boolean;
  isUsableNight: boolean;
}

interface ApplicantContactInfo {
  contactID: number;
  applicantID: number;
  homeEmail: string;
  workEmail: string;
  contactNumbers: ApplicantContactNumber[];
}

interface ApplicantPassportInfo {
  passportID: number;
  applicantID: number;
  passportNum: string;
  issueDate: Date | string;
  isIssuedEst: boolean;
  expirationDate: Date | string;
  isExpirationEst: boolean;
  passportLName: string;
  passportFName: string;
  passportMName: string;
  passportSuffix: string;
  hasPassport: boolean;
}

interface ApplicantDocuments {
  docID: number;
  applicantID: number;
  docType: string;
  docNum: string;
  docIssueDate: Date | string;
  isDocDateEst: boolean;
  docExpireDate: Date | string;
  isDocExpirationEst: boolean;
  docIssuerLName: string;
  docIssuerFName: string;
  docIssuerMName: string;
  docIssuerSuffix: string;
  documentIssued: string;
  otherDoc: string;
}

interface ApplicantResidency {
  residenceID: number; // Optional, assuming it's auto-generated or not applicable in all contexts
  applicantID: number; // Optional for similar reasons
  residenceStartDate: string;
  isStartDateEst: boolean;
  residenceEndDate: string;
  isResidenceEndEst: boolean;
  isResidencePresent: boolean;
  residenceStatus: "Owned" | "Rented" | "Military housing" | "Other";
  residenceOtherDetails?: string;
  residenceAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    hasAPOOrFPO: boolean;
    APOOrFPODetails?: {
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
    };
  };
  contact: {
    lastname: string;
    firstname: string;
    middlename?: string;
    suffix?: string;
    lastContactDate: string;
    isLastContactEst: boolean;
    relationship:
      | "Neighbor"
      | "Friend"
      | "Landlord"
      | "Business associate"
      | "Other";
    relationshipOtherDetail?: string;
    phone: {
      type: "Evening" | "Daytime" | "Cell/mobile";
      knowsNumber: boolean;
      isInternationalOrDSN: boolean;
      number?: string;
      extension?: string;
    };
    email?: string;
    contactAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      hasAPOOrFPO?: boolean;
      APOOrFPODetails?: {
        streetUnitLocation?: string;
        cityPostName?: string;
        state?: string;
        zip?: string;
        country?: string;
      };
    };
  };
}

interface ApplicantContacts {
  contactID: number;
  applicantID: number;
  contactSurname: string;
  contactFirstname: string;
  contactMiddlename: string;
  contactSuffix: string;
  lastContactDate: Date | string;
  isLastContactEst: boolean;
  contactRelationship: string;
  relationshipOtherDetail: string;
  phoneType: string;
  knowsNumber: boolean;
  isInternationalOrDSN: boolean;
  phoneNumber: string;
  phoneExtension: string;
  hasEmail: boolean;
  contactEmail: string;
  contactStreet: string;
  contactCity: string;
  Zip: string;
  contactCountry: string;
  contactAPOFPO: boolean;
  contactAPOFPOAddress: string;
}

export type {
  ApplicantInfo,
  ApplicantPersonalInfo,
  ApplicantNames,
  ApplicantBirthInfo,
  ApplicantPhysicalAttributes,
  ApplicantContactInfo,
  ApplicantPassportInfo,
  CitizenshipNaturalizationInfo,
  ApplicantDocuments,
  ApplicantResidency,
  ApplicantContacts,
  ApplicantContactNumber,
};
