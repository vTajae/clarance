import { Field } from "~/components/form86/lastTry/formDefinition copy 2";


interface DualCitizenshipFormData {
    heldMultipleCitizenships: Field<"YES" | "NO (If NO, proceed to 10.2)">;
    citizenships?: CitizenshipDetail[];
    hadNonUSPassport: Field<"YES" | "NO (If NO, proceed to Section 11)">;
    passports?: PassportDetail[];
  }

  
  interface CitizenshipDetail {
    _id: number;
    country: Field<string>;
    howCitizenshipAcquired: Field<string>;
    citizenshipStart: Field<string>;
    isCitizenshipStartEstimated: Field<"YES" | "No">;
    citizenshipEnd?: Field<string>;
    isCitizenshipEndPresent: Field<"YES" | "No">;
    isCitizenshipEndEstimated?: Field<"YES" | "No">;
    isReNounced: Field<"YES" | "No">;
    reNouncementDetails?: Field<string>;
    isCitizenshipHeld: Field<"YES" | "No">;
    citizenshipExplanation?: Field<string>;
  }
  

  interface PassportDetail {
    _id: number;
    countryIssued: Field<string>;
    passportDateIssued: Field<string>;
    isPassportDateEst: Field<"Yes" | "No">;
    passportCity: Field<string>;
    passportCountry: Field<string>;
    passportLName: Field<string>;
    passportFName: Field<string>;
    passportMName?: Field<string>;
    passportSuffix?: Field<string>;
    passportNumber: Field<string>;
    passportExpiration: Field<string>;
    isExpirationEst: Field<"Yes" | "No">;
    isPassportUsed: Field<"Yes" | "No">;
    passportUses?: PassportUse[];
  }
  
  interface PassportUse {
    _id: number;
    passportCountry: Field<string>;
    fromDate: Field<string>;
    toDate?: Field<string>;
    isFromDateEst: Field<"Yes" | "No">;
    isToDateEst?: Field<"Yes" | "No">;
    isVisitCurrent: Field<"Yes" | "No">;
  }

  

  export type { DualCitizenshipFormData, CitizenshipDetail, PassportDetail, PassportUse }; 