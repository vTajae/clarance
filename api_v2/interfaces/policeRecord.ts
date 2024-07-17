interface DateInfo {
    date: string;
    estimated: boolean;
}

interface Location {
    city: string;
    county: string;
    state: string;
    zip: string;
    country: string;
}

interface Charge {
    _id: number;
    felonyMisdemeanor: 'Felony' | 'Misdemeanor';
    charge: string;
    outcome: string;
    dateInfo: DateInfo;
}

interface DateRange {
    from: string;
    to: string;
    estimated: boolean;
    present: boolean;
}

interface Section22_1 {
    dateOfOffense: DateInfo;
    description: string;
    involvedDomesticViolence: boolean;
    involvedFirearms: boolean;
    involvedAlcoholDrugs: boolean;
    offenseLocation: Location;
    arrestedSummonedCited: boolean; // (If NO, proceed to (c))
    lawEnforcementAgencyName: string;
    lawEnforcementLocation: Location;
    chargedConvicted: boolean; // If YES, complete (c.1))
    courtName: string;
    courtLocation: Location;
    charges: Charge[];
    sentenced: boolean; // (If YES, complete (d.1)) (If NO, complete (d.2))
    sentenceDescription: string;
    imprisonmentTermExceeding1Year: boolean;
    imprisonmentLessThan1Year: boolean;
    imprisonmentDates: DateRange;
    probationParoleDates: DateRange;
    awaitingTrial: boolean;
    awaitingTrialExplanation: string;
}

interface Section22_2 {
    dateOfOffense: DateInfo;
    description: string;
    involvedDomesticViolence: boolean;
    involvedFirearms: boolean;
    involvedAlcoholDrugs: boolean;
    courtName: string;
    courtLocation: Location;
    charges: Charge[];
    sentenced: boolean; // (If YES, complete (b.1)) (If NO, complete (b.2))
    sentenceDescription: string;
    imprisonmentTermExceeding1Year: boolean;
    imprisonmentLessThan1Year: boolean;
    imprisonmentDates: DateRange;
    probationParoleDates: DateRange;
    awaitingTrial: boolean;
    awaitingTrialExplanation: string;
}

interface OrderInfo {
    explanation: string;
    dateIssued: DateInfo;
    courtAgencyName: string;
    courtAgencyLocation: Location;
}

interface Section22_3 {
    hasRestrainingOrder: boolean;
    orders: OrderInfo[];
}

interface PoliceRecord {
    _id: number;
    part1Questions: boolean;
    part2Questions: boolean;
    restrainingOrder: boolean;
    section22_1?: Section22_1[];
    section22_2?: Section22_2[];
    section22_3?: Section22_3[];
}

export type { PoliceRecord, Section22_1, Section22_2, Section22_3, Charge, DateRange, Location, DateInfo, OrderInfo };
