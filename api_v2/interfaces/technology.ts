interface Technology {
    _id: number;
    illegalAccess: boolean; // (If NO, proceed to 27.2)
    illegalModification: boolean; // (If NO, proceed to 27.3)
    unauthorizedUse: boolean; // (If NO, proceed to 27.4)
    section27_1?: Section27_1[];
    section27_2?: Section27_2[];
    section27_3?: Section27_3[];
  }
  
  interface DateInfo {
    date: string;
    estimated: boolean;
  }
  
  interface DateRange {
    from: DateInfo;
    to: DateInfo;
    present: boolean;
  }
  
  interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  interface Section27_1 {
    incidentDate: DateInfo;
    description: string;
    location: Address;
    actionDescription: string;
  }
  
  interface Section27_2 {
    incidentDate: DateInfo;
    description: string;
    location: Address;
    actionDescription: string;
  }
  
  interface Section27_3 {
    incidentDate: DateInfo;
    description: string;
    location: Address;
    actionDescription: string;
  }

  export type { Technology, DateInfo, DateRange, Address, Section27_1, Section27_2, Section27_3 };