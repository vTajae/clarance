interface Association {
    _id: number;
    terrorismMember: boolean; // (If NO, proceed to 29.2)
    actsOfTerrorism: boolean; // (If NO, proceed to 29.3)
    overthrowByForce: boolean; // (If NO, proceed to 29.4)
    dedicatedViolent: boolean; // (If NO, proceed to 29.5)
    advocatesViolence: boolean; // (If NO, proceed to 29.6)
    engagedInOverthrow: boolean; // (If NO, proceed to 29.7)
    terrorismAssociate: boolean;
    section29_1?: Section29_1[];
    section29_2?: Section29_2[];
    section29_3?: Section29_3[];
    section29_4?: Section29_4[];
    section29_5?: Section29_5[];
    section29_6?: Section29_6[];
    section29_7?: Section29_7[];
  }
  
  interface Section29_1 {
    activityDescription: string;
    dateRange: DateRange;
  }
  
  interface Section29_2 {
    organizationName: string;
    organizationAddress: Address;
    involvementDateRange: DateRange;
    positionsHeld: string;
    contributions: string;
    natureOfInvolvement: string;
  }
  
  interface Section29_3 {
    reasonsForAdvocacy: string;
    dateRange: DateRange;
  }
  
  interface Section29_4 {
    organizationName: string;
    organizationAddress: Address;
    involvementDateRange: DateRange;
    positionsHeld: string;
    contributions: string;
    natureOfInvolvement: string;
  }
  
  interface Section29_5 {
    organizationName: string;
    organizationAddress: Address;
    involvementDateRange: DateRange;
    positionsHeld: string;
    contributions: string;
    natureOfInvolvement: string;
  }
  
  interface Section29_6 {
    activityDescription: string;
    dateRange: DateRange;
  }
  
  interface Section29_7 {
    explanation: string;
  }
  
  interface DateRange {
    from: DateInfo;
    to: DateInfo;
    present: boolean;
  }
  
  interface DateInfo {
    date: string;
    estimated: boolean;
  }
  
  interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  export type {
    Association,
    Section29_1,
    Section29_2,
    Section29_3,
    Section29_4,
    Section29_5,
    Section29_6,
    Section29_7,
    DateRange,
    DateInfo,
    Address
  };
  