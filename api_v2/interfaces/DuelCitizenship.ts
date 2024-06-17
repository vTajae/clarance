interface DualCitizenshipFormData {
    heldMultipleCitizenships: boolean;
    citizenships: CitizenshipDetail[];
    hadNonUSPassport: boolean;
    passports: PassportDetail[];
  }

  
  interface CitizenshipDetail {
    _id: number;
    country: string;
    howCitizenshipAcquired: string;
    citizenshipStart: string;
    isCitizenshipStartEstimated: boolean;
    citizenshipEnd?: string;
    isCitizenshipEndPresent: boolean;
    isCitizenshipEndEstimated?: boolean;
    isRenounced: boolean;
    renouncementDetails?: string;
    isCitizenshipHeld: boolean;
    citizenshipExplanation?: string;
  }
  

  interface PassportDetail {
    _id: string;
    countryIssued: string;
    passportDateIssued: string;
    isPassportDateEst: boolean;
    passportCity: string;
    passportCountry: string;
    passportLName: string;
    passportFName: string;
    passportMName?: string;
    passportSuffix?: string;
    passportNumber: string;
    passportExpiration: string;
    isExpirationEst: boolean;
    isPassportUsed: boolean;
    passportUses: PassportUse[];
  }
  
  interface PassportUse {
    _id: number;
    passportCountry: string;
    fromDate: string;
    toDate?: string;
    isFromDateEst: boolean;
    isToDateEst?: boolean;
    isVisitCurrent: boolean;
  }

  export type { DualCitizenshipFormData, CitizenshipDetail, PassportDetail, PassportUse }; 