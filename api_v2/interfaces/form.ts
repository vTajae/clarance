// Enums for dropdown options
enum Suffix {
    None = "",
    Jr = "Jr",
    Sr = "Sr",
    II = "II",
    III = "III",
    IV = "IV",
    V = "V",
    VI = "VI",
    VII = "VII",
    IX = "IX",
    X = "X",
    Other = "Other",
  }
  
  enum Gender {
    Male = "Male",
    Female = "Female",
  }
  
  // HairColor, EyeColor, States, Countries, etc., can be similarly defined.
  
  // Interface for the user's personal information
  interface PersonalInfo {
    applicantID: string;
    lastName: string;
    firstName: string;
    middleName: string;
    suffix: Suffix;
    dob: string | null;
    estimateDob: boolean;
    birthCity: string;
    birthCounty: string;
    birthState: string; // This could be an enum if you have a fixed list of states
    birthCountry: string; // This could be an enum if you have a fixed list of countries
    aliases: Alias[];
    gender: Gender | null;
    weight: number | null;
    hairColor: string; // This could be an enum
    eyeColor: string; // This could be an enum
    heightFeet: number | null;
    heightInches: number | null;
    contactInformation: ContactInformation;
  }
  
  // Interface for aliases used by the user
  interface Alias {
    lastName: string;
    firstName: string;
    middleName: string;
    suffix: string;
    reasonForChange: string;
    startDate: string;
    endDate: string;
    isEstimateStart: boolean;
    isEstimateEnd: boolean;
    isCurrentlyUsed: boolean;
    usedMaidenName: boolean;
  }
  
  // Interface for contact information
  interface ContactInformation {
    homeEmail: string;
    workEmail: string;
    homePhone: Phone;
    workPhone: Phone;
    cellPhone: Phone;
  }
  
  interface Phone {
    number: string;
    extension: string;
    isInternational: boolean;
    availableNight: boolean;
    availableDay: boolean;
  }

  interface CitizenshipInfo {
    documentNumber: string;
    issueDate: string;
    issueDateEstimate: boolean;
    expirationDate: string;
    expirationDateEstimate: boolean;
    lastName: string;
    firstName: string;
    middleName: string;
    suffix: string;
    
    // For Naturalized Citizens
    entryDate: string;
    entryDateEstimate: boolean;
    entryCity: string;
    entryState: string;
    priorCitizenships: string[];
    alienRegistrationNumber?: string;
    certificateOfNaturalizationNumber: string;
    naturalizationCertificateIssueDate: string;
    naturalizationCertificateIssueDateEstimate: boolean;
    courtName: string;
    courtAddress: string;
    courtCity: string;
    courtState: string;
    courtZipCode: string;
    basisOfNaturalization: string;
    basisOfNaturalizationExplanation?: string;
  
    // For Derived Citizens
    permanentResidentCardNumber?: string;
    certificateOfCitizenshipNumber?: string;
    derivedCertificateIssueDate?: string;
    derivedCertificateIssueDateEstimate?: boolean;
    alienRegistrationNumberDerived?: string;
    nameOnDerivedDocument?: {
      lastName?: string;
      firstName?: string;
      middleName?: string;
      suffix?: string;
    };
    basisOfDerivedCitizenship?: string; // "By operation of law through my U.S. citizen parent." or "Other"
    basisOfDerivedCitizenshipExplanation?: string;
  
    // For Non-Citizens
    residenceStatus?: string;
    nonCitizenEntryDate?: string;
    nonCitizenEntryDateEstimate?: boolean;
    countryOfCitizenship?: string[];
    placeOfEntry?: string;
    alienRegistrationNumberNonCitizen?: string;
    documentExpirationDate?: string;
    documentExpirationDateEstimate?: boolean;
    documentationType?: string;
    documentationNumber?: string;
    documentationIssueDate?: string;
    documentationIssueDateEstimate?: boolean;
    documentationExpirationDate?: string;
    documentationTypeBornAbroadExplanation?: string;
    documentationTypeBornAbroad?: string;
    documentNumberBornAbroad?: string;
    documentationExpirationDateEstimate?: boolean;
    nameOnDocumentation?: {
      lastName?: string;
      firstName?: string;
      middleName?: string;
      suffix?: string;
    };
    militaryBaseName?: string;
    documentIssueDateBornAbroad?: string;
    bornOnMilitaryInstallation?: string,
    documentIssueDateBornAbroadEstimate?: boolean,
    issuanceCity?: string,
    issuanceCountry?: string,
  
    // Any additional fields as required by the application's logic
  }

  interface DualCitizenshipInfo {
    hasDualCitizenship: string;
    countryOfCitizenship: string;
    acquisitionMethod: string;
    citizenshipFromDate: string;
    fromDateEstimate: boolean;
    citizenshipToDate: string;
    toDateEstimate: boolean;
    toDatePresent: boolean;
    renouncedCitizenship: string;
    renouncementExplanation: string;
  }

  interface ResidenceForm {
    isAPOFPO?: boolean;
    isForeign?: boolean;
    isNormal?: boolean;
    residenceStartDate?: string;
    residenceStartDateEstimate?: boolean;
    residenceEndDate?: string;
    residenceEndDatePresent?: boolean;
    residenceEndDateEstimate?: boolean;
    residenceType?: string;
    otherResidenceTypeExplanation?: string;
    streetAddress?: string;
    city?: string;
    zipCode?: string;
    state?: string;
    country?: string;
    addressType?: string; // For APO/FPO, Foreign, or Normal address selection
    neighborLastName?: string;
    neighborFirstName?: string;
    neighborMiddleName?: string;
    lastContactDate?: string;
    relationshipToResidence?: string;
    otherRelationshipDescription?: string;
    lastContactDateEstimate?: boolean;
    neighborSuffix?: string;
    relationshipToNeighbor?: string[];
    eveningPhoneNumber?: string;
    eveningPhoneExtension?: string;
    isEveningPhoneInternational?: boolean;
    dontKnowEveningPhone?: boolean;
    // Similar fields for daytime phone, cellphone, and email
  }
  
  

  export type {  Phone ,ResidenceForm, CitizenshipInfo,DualCitizenshipInfo, ContactInformation, Alias, PersonalInfo }

  export { Suffix, Gender}