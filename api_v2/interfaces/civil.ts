interface Civil {
    _id: number;
    civilCourt: boolean; // (If NO, proceed to 26.2)
    section28_1?: Section28_1[];
  }
  
  interface Section28_1 {
    dateOfAction: DateInfo;
    courtName: string;
    courtAddress: Address;
    description: string;
    principalParties: string[];
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
  
  export type { Civil, Section28_1, DateInfo, DateRange, Address };
  