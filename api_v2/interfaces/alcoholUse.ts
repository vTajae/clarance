interface AlcoholUse {
  _id: number;
  negativeImpact: boolean; // (If NO, proceed to 24.2)
  suggestedCounseling: boolean; // (If NO, proceed to 24.3)
  voluntaryCounseling: boolean; // (If NO, proceed to 24.4)
  additionalCounseling: boolean; // (If NO, proceed to 25)
  section24_1?: Section24_1[];
  section24_2?: Section24_2[];
  section24_3?: Section24_3[];
  section24_4?: Section24_4[];
}

interface Section24_1 {
  negativeImpactDate: DateInfo;
  datesOfInvolvement: DateRange;
  circumstances: string;
  negativeImpact: string;
}

interface Section24_2 {
  orderedBy: OrderedBy;
  actionTaken: boolean; // Did you take action to receive counseling or treatment?
  noActionExplanation: string; // Explanation if 'No' to action taken
  actionDetails: CounselingDetails;
}

interface CounselingDetails {
  dateRange: DateRange;
  providerName: string;
  providerAddress: Address;
  providerPhone: string;
  phoneExtension: string;
  internationalPhone: boolean;
  phoneDayNight: "Day" | "Night";
  treatmentCompletion: boolean;
  completionExplanation: string;
}

interface Section24_3 {
  dateRange: DateRange;
  providerName: string;
  providerAddress: Address;
  providerPhone: string;
  phoneExtension: string;
  internationalPhone: boolean;
  phoneDayNight: "Day" | "Night";
  treatmentCompletion: boolean;
  completionExplanation: string;
}

interface Section24_4 {
  counselorName: string;
  counselorAddress: Address;
  agencyName: string;
  agencyAddress: Address;
  dateRange: DateRange;
  treatmentCompletion: boolean;
  completionExplanation: string;
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

interface OrderedBy {
  _id: number;
  type: string;
}

export type {
  AlcoholUse,
  Section24_1,
  Section24_2,
  Section24_3,
  Section24_4,
  CounselingDetails,
  DateInfo,
  DateRange,
  Address,
};
