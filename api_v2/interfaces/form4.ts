import { CitizenshipNaturalizationInfo } from "./Citizenship";
import { DualCitizenshipFormData } from "./DuelCitizenship";
import { ApplicantResidency } from "./Residency";

interface ApplicantInfo {
  personalInfo: ApplicantPersonalInfo;
  names: ApplicantNames[];
  birthInfo: ApplicantBirthInfo;
  physicalAttributes: ApplicantPhysicalAttributes;
  contactInfo: ApplicantContactInfo;
  passportInfo: ApplicantPassportInfo;
  citizenshipInfo: CitizenshipNaturalizationInfo;
  duelCitizenshipInfo: DualCitizenshipFormData;
  residencyInfo: ApplicantResidency[];
}

interface ApplicantPersonalInfo {
  applicantID: number;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  ssn?: string;
  gender: string;
  isNotApplicable: boolean;
}

interface ApplicantNames {
  nameID: number;
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
  birthDate: Date | string;
  isBirthDateEstimate: boolean;
  birthCity: string;
  birthState: string;
  birthCountry: string;
}

interface ApplicantPhysicalAttributes {
  attributeID: number;
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
  homeEmail: string;
  workEmail: string;
  contactNumbers: ApplicantContactNumber[];
}

interface ApplicantPassportInfo {
  passportID: number;
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

interface ApplicantContacts {
  contactID: number;
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
