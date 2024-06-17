  
  interface MilitaryHistoryInfo {
    everServedInUSMilitary: boolean | null; // null to represent unanswered state
    disciplinaryProcedure: boolean | null; // null to represent unanswered state
    everServedInForeignMilitary: boolean | null; // null to represent unanswered state
    section15_1: MilitaryServiceEntry[];
    section15_2: CourtMartialEntry[];
    section15_3: ForeignServiceEntry[];
  }
  
  interface MilitaryServiceEntry {
    _id: number;
    branch: 'Army' | 'ArmyNationalGuard' | 'Navy' | 'AirForce' | 'AirNationalGuard' | 'MarineCorps' | 'CoastGuard';
    stateOfService?: string; // Optional, if applicable for National Guard
    status: 'ActiveDuty' | 'ActiveReserve' | 'InactiveReserve';
    officerOrEnlisted: 'NotApplicable' | 'Officer' | 'Enlisted';
    serviceNumber?: string; // Optional
    serviceFromDate: string; // Assuming format 'MM/YYYY'
    serviceToDate: string | null; // null if still serving
    present: boolean; // true if still serving
    estimatedFromDate: boolean;
    estimatedToDate: boolean;
    discharged: boolean | null; // null to represent unanswered state
    typeOfDischarge?: 'Honorable' | 'General' | 'UnderOtherThanHonorableConditions' | 'BadConduct' | 'Dishonorable' | 'Other'; // Optional
    dischargeTypeOther?: string; // Optional, if discharge type is 'Other'
    dischargeDate?: string; // Optional, if discharged
    estimatedDischargeDate?: boolean; // Optional
    dischargeReason?: string; // Optional, if discharge type is other than Honorable
  }
  
  interface CourtMartialEntry {
    _id: number;
    date: string; // Assuming format 'MM/YYYY'
    estimatedDate: boolean;
    descriptionOfOffense: string;
    nameOfProcedure: string;
    courtDescription: string;
    outcomeDescription: string;
  }
  
  interface ForeignServiceEntry {
    _id: number;
    organizationType: 'Military' | 'IntelligenceService' | 'DiplomaticService' | 'SecurityForces' | 'Militia' | 'OtherDefenseForces' | 'Other';
    organizationTypeOther?: string; // Optional, if organization type is 'Other'
    organizationName: string;
    country: string;
    periodOfServiceFrom: string; // Assuming format 'MM/YYYY'
    periodOfServiceTo: string | null; // null if still serving
    present: boolean; // true if still serving
    estimatedPeriodFrom: boolean;
    estimatedPeriodTo: boolean;
    highestRank: string;
    departmentOrOffice: string;
    associationDescription: string;
    reasonForLeaving: string;
    maintainsContact: boolean | null; // null to represent unanswered state
    contacts: ContactEntry[];
  }
  
  interface ContactEntry {
    _id: number;
    lastName: string;
    firstName: string;
    middleName?: string; // Optional
    suffix?: string; // Optional
    address: Address;
    officialTitle: string;
    frequencyOfContact: string;
    associationFrom: string; // Assuming format 'MM/YYYY'
    associationTo: string | null; // null if ongoing
    present: boolean; // true if ongoing
    estimatedAssociationFrom: boolean;
    estimatedAssociationTo: boolean;
  }
  
  interface Address {
    street: string;
    city: string;
    state?: string; // Optional, if applicable
    zipCode?: string; // Optional, if applicable
    country: string;
  }
  

export type { MilitaryHistoryInfo, Address, ContactEntry, CourtMartialEntry, ForeignServiceEntry, MilitaryServiceEntry }