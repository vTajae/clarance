import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

  interface MilitaryHistoryInfo {
    everServedInUSMilitary: Field<"YES" | "NO"> ; // null to represent unanswered state
    disciplinaryProcedure: Field<"YES" | "NO"> ; // null to represent unanswered state
    everServedInForeignMilitary: Field<"YES" | "NO"> ; // null to represent unanswered state
    section15_1?: MilitaryServiceEntry[];
    section15_2?: CourtMartialEntry[];
    section15_3?: ForeignServiceEntry[];
  }
  
  interface MilitaryServiceEntry {
    _id: number;
    branch: Field<'Army' | 'ArmyNationalGuard' | 'Navy' | 'AirForce' | 'AirNationalGuard' | 'MarineCorps' | 'CoastGuard'>;
    stateOfService?: Field<string>; // Optional, if applicable for National Guard
    status: Field<'ActiveDuty' | 'ActiveReserve' | 'InactiveReserve'>;
    officerOrEnlisted: Field<'NotApplicable' | 'Officer' | 'Enlisted'>;
    serviceNumber?: Field<string>; // Optional
    serviceFromDate: Field<string>; // Assuming format 'MM/YYYY'
    serviceToDate: Field<string> ; // null if still serving
    present: Field<"YES" | "NO">; // true if still serving
    estimatedFromDate: Field<"YES" | "NO">;
    estimatedToDate: Field<"YES" | "NO">;
    discharged: Field<"YES" | "NO"> ; // null to represent unanswered state
    typeOfDischarge?: Field<'Honorable' | 'General' | 'UnderOtherThanHonorableConditions' | 'BadConduct' | 'Dishonorable' | 'Other'>; // Optional
    dischargeTypeOther?: Field<string>; // Optional, if discharge type is 'Other'
    dischargeDate?: Field<string>; // Optional, if discharged
    estimatedDischargeDate?: Field<"YES" | "NO">; // Optional
    dischargeReason?: Field<string>; // Optional, if discharge type is other than Honorable
  }
  
  interface CourtMartialEntry {
    _id: number;
    date: Field<string>; // Assuming format 'MM/YYYY'
    estimatedDate: Field<"YES" | "NO">;
    descriptionOfOffense: Field<string>;
    nameOfProcedure: Field<string>;
    courtDescription: Field<string>;
    outcomeDescription: Field<string>;
  }
  
  interface ForeignServiceEntry {
    _id: number;
    organizationType: Field<'Military' | 'IntelligenceService' | 'DiplomaticService' | 'SecurityForces' | 'Militia' | 'OtherDefenseForces' | 'Other'>;
    organizationTypeOther?: Field<string>; // Optional, if organization type is 'Other'
    organizationName: Field<string>;
    country: Field<string>;
    periodOfServiceFrom: Field<string>; // Assuming format 'MM/YYYY'
    periodOfServiceTo: Field<string>; // null if still serving
    present: Field<"YES" | "NO">; // true if still serving
    estimatedPeriodFrom: Field<"YES" | "NO">;
    estimatedPeriodTo: Field<"YES" | "NO">;
    highestRank: Field<string>;
    departmentOrOffice: Field<string>;
    associationDescription: Field<string>;
    reasonForLeaving: Field<string>;
    maintainsContact: Field<"YES" | "NO">; // null to represent unanswered state
    contacts: ContactEntry[];
  }
  
  interface ContactEntry {
    _id: number;
    lastName: Field<string>;
    firstName: Field<string>;
    middleName?: Field<string>; // Optional
    suffix?: Field<string>; // Optional
    address: Address;
    officialTitle: Field<string>;
    frequencyOfContact: Field<string>;
    associationFrom: Field<string>; // Assuming format 'MM/YYYY'
    associationTo: Field<string>; // null if ongoing
    present: Field<"YES" | "NO">; // true if ongoing
    estimatedAssociationFrom: Field<"YES" | "NO">;
    estimatedAssociationTo: Field<"YES" | "NO">;
  }
  
  interface Address {
    street: Field<string>;
    city: Field<string>;
    state?: Field<string>; // Optional, if applicable
    zipCode?: Field<string>; // Optional, if applicable
    country: Field<string>;
  }
  

export type { MilitaryHistoryInfo, Address, ContactEntry, CourtMartialEntry, ForeignServiceEntry, MilitaryServiceEntry }