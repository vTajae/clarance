interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface CourtAgency {
    name: string;
    address: Address;
}

interface Section21A {
    dateOccurred: string;
    estimated: boolean;
    courtAgency: CourtAgency;
    appealed: boolean;
    appeals?: Appeal[];
}

interface Appeal {
    _id: number;
    courtAgency: CourtAgency;
    finalDisposition: string;
}

interface Section21B {
    dateOccurred: string; 
    estimated: boolean;
    courtAgency: CourtAgency;
    finalDisposition: string;
    appealed: boolean;
    appeals?: Appeal[];
}

interface Section21C {
    voluntary: boolean;
    explanation: string;
    facility: Facility;
    fromDate: string; // Month/Year
    toDate: string; // Month/Year
    present: boolean;
    estimatedFrom: boolean;
    estimatedTo: boolean;
}

interface Facility {
    name: string;
    address: Address;
}

interface Section21D {
    diagnosis: string;
    datesOfDiagnosis: { fromDate: string; toDate: string; present: boolean; estimatedFrom: boolean; estimatedTo: boolean };
    healthCareProfessional: HealthCareProfessional;
    agencyOrFacility: AgencyOrFacility;
    counselingEffective: boolean;
    counselingExplanation?: string;
}

interface HealthCareProfessional {
    name: string;
    telephoneNumber: string;
    extension: string;
    day: boolean;
    night: boolean;
    internationalOrDsnPhoneNumber: boolean;
    address: Address;
}

interface AgencyOrFacility {
    name: string;
    address: Address;
    telephoneNumber: string;
    extension: string;
    day: boolean;
    night: boolean;
    internationalOrDsnPhoneNumber: boolean;
}

interface Section21D1 {
    healthCareProfessional: HealthCareProfessional;
}

interface Section21E {
    fromDate: string; // Month/Year
    toDate: string; // Month/Year
    present: boolean;
    estimatedFrom: boolean;
    estimatedTo: boolean;
    healthCareProfessional: HealthCareProfessional;
    agencyOrFacility: AgencyOrFacility;
    choseNotToFollow: boolean;
    explanation?: string;
}

interface MentalHealth {
    _id: number;
    declaredMentallyIncompetent: boolean; // (If NO, proceed to Section 21B)
    consultMentalHealth: boolean; // (If NO, proceed to Section 21C)
    hospitalizedMentalHealth: boolean; // (If NO, proceed to Section 21D)
    beenDiagnosed: boolean; // (If NO, proceed to Section 21E)
    delayedTreatment: boolean; 
    currentlyInTreatment: boolean; // If (NO, proceed to Section 21E)

    // Complete the following if you responded ‘No’ to 21A, 21B, 21C, and 21D (All). If ‘Yes’ was selected for either 21A, 21B, 21C, or 21D, proceed to Section 22.
    substantialAffects: boolean;

    // Complete the following if you responded 'Yes' to having a mental health condition that adversely affects your judgment, reliability, or trustworthiness
    counseling: boolean; // (If I decline to answer, proceed to Section 22)

    section21A?: Section21A[];
    section21B?: Section21B[];
    section21C?: Section21C[];
    section21D?: Section21D[];
    section21D1?: Section21D1[];
    section21E?: Section21E[];
}


export type { MentalHealth, Section21A, Section21B, Section21C, Section21D, Section21D1, Section21E, Address, CourtAgency, Appeal, Facility, HealthCareProfessional, AgencyOrFacility}