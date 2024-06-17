
// Applicant Personal Information
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


// Applicant Names
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


// Applicant Birth Information
interface ApplicantBirthInfo {
  birthInfoID: number;
  applicantID: number;
  birthDate: Date | string;
  isBirthDateEstimate: boolean;
  birthCity: string;
  birthState: string;
  birthCountry: string;
}


// Applicant Physical Attributes
interface ApplicantPhysicalAttributes {
  attributeID: number;
  applicantID: number;
  heightFeet: number;
  heightInch: number;
  weight: number;
  hairColor: string;
  eyeColor: string;
}


// Applicant Contact Information
interface ApplicantContactInfo {
  contactID: number;
  applicantID: number;
  homeEmail: string;
  workEmail: string;
  phoneNum: string;
  phoneExtension: string;
  isUsableDay: boolean;
  isUsableNight: boolean;
  numberType: string;
}

// Applicant Passport Information
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

// Citizenship Naturalization Information
interface CitizenshipNaturalizationInfo {
  citizenshipID: number;
  applicantID: number;
  citizenshipStatusCode: string;
  docType: string;
  otherDoc: string;
  docNum: string;
  docIssueDate: Date | string;
  isIssueDateEst: boolean;
  issueCity: string;
  issuedState: string;
  issuedCountry: string;
  basisOfCitizenship: string;
  basisOfCitizenshipExplanation: string;
  hasAlienRegistration: boolean;
  alienRegistrationNum: string;
  naturalizationNum: string;
  naturalizationIssueDate: Date | string;
  isNaturalIssueEst: boolean;
  countriesOfCitizenship: string;
  permanentResidentNum: string;
  certificateOfCitizenshipNum: string;
}

// Applicant Documents
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

// Applicant Residency
interface ApplicantResidency {
  residencyID: number;
  applicantID: number;
  residenceStartDate: Date | string;
  isStartDateEst: boolean;
  residenceEndDate: Date | string;
  isResidenceEndEst: boolean;
  isResidencePresent: boolean;
  residenceStatus: string;
  residenceOtherDetails: string;
  residenceStreet: string;
  residenceCity: string;
  residenceState: string;
  residenceZip: string;
  residenceCountry: string;
  hasAPOOrFPO: boolean;
  apoOrFPOAddress: string;
}

// Applicant Contacts
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
  contactState: string;
  contactZip: string;
  contactCountry: string;
  contactAPOFPO: boolean;
  contactAPOFPOAddress: string;
}


export type { ApplicantPersonalInfo, ApplicantNames, ApplicantBirthInfo, ApplicantPhysicalAttributes, ApplicantContactInfo, ApplicantPassportInfo, CitizenshipNaturalizationInfo, ApplicantDocuments, ApplicantResidency, ApplicantContacts }