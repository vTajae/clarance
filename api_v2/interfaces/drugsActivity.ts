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

interface DrugType {
  _id: number;
  type:
    | "Cocaine or crack cocaine (Such as rock, freebase, etc.)"
    | "THC (Such as marijuana, weed, pot, hashish, etc.)"
    | "Ketamine (Such as special K, jet, etc.)"
    | "Narcotics (Such as opium, morphine, codeine, heroin, etc.)"
    | "Stimulants (Such as amphetamines, speed, crystal meth, ecstasy, etc.)"
    | "Depressants (Such as barbiturates, methaqualone, tranquilizers, etc.)"
    | "Hallucinogenic (Such as LSD, PCP, mushrooms, etc.)"
    | "Steroids (Such as the clear, juice, etc.)"
    | "Inhalants (Such as toluene, amyl nitrate, etc.)"
    | "Other";
}

interface Section23_1 {
  typeOfDrug: DrugType[]; // List of drugs used
  otherDrugExplanation?: string; // Explanation if "Other" is checked
  firstUse: DateInfo;
  mostRecentUse: DateInfo;
  natureOfUseFrequencyTimes: string;
  useWhileEmployedInPublicSafety: boolean;
  useWhilePossessingSecurityClearance: boolean;
  intendToUseInFuture: boolean;
  futureUseExplanation: string;
}

interface Section23_2 {
  typeOfDrug: DrugType[]; // List of drugs involved
  otherDrugExplanation?: string; // Explanation if "Other" is checked
  firstInvolvement: DateInfo;
  mostRecentInvolvement: DateInfo;
  natureAndFrequencyOfActivity: string;
  reasonsForActivity: string;
  involvementWhileEmployedInPublicSafety: boolean;
  involvementWhilePossessingSecurityClearance: boolean;
  intendToEngageInFuture: boolean;
  futureEngagementExplanation: string;
}

interface Section23_3 {
  descriptionOfInvolvement: string;
  dateRange: DateRange;
  numberOfTimesInvolved: string;
}

interface Section23_4 {
  descriptionOfInvolvement: string;
  dateRange: DateRange;
  numberOfTimesInvolved: string;
}

interface Section23_5 {
  nameOfPrescriptionDrug: string;
  dateRange: DateRange;
  reasonsForMisuse: string;
  involvementWhileEmployedInPublicSafety: boolean;
  involvementWhilePossessingSecurityClearance: boolean;
}

interface TreatmentProvider {
  lastName: string;
  firstName: string;
}

interface TreatmentProviderPhone {
  number: string;
  extension?: string;
  international: boolean;
  timeOfDay: "Day" | "Night";
}

interface PersonOrdered {
  _id: number;
  name:
    | "An employer, military commander, or employee assistance program"
    | "A medical professional"
    | "A mental health professional"
    | "A court official / judge"
    | "I have not been ordered, advised, or asked to seek"
    | "counseling or treatment by any of the above.";
}

interface Section23_6 {
  orderedBy: PersonOrdered[];
  orderedExplanation?: string;
  receivedTreatment: boolean;
  noTreatmentExplanation?: string;
  typeOfDrug?: DrugType[];
  otherDrugExplanation?: string;
  treatmentProviderName?: TreatmentProvider;
  treatmentProviderAddress?: Address;
  treatmentProviderPhone?: TreatmentProviderPhone;
  dateRange?: DateRange;
  successfullyCompleted?: boolean;
  completionExplanation?: string;
}

interface Section23_7 {
  typeOfDrug: DrugType[];
  otherDrugExplanation?: string; // Explanation if "Other" is checked
  treatmentProviderName: TreatmentProvider;
  treatmentProviderAddress: Address;
  treatmentProviderPhone: TreatmentProviderPhone;
  dateRange: DateRange;
  successfullyCompleted: boolean;
  completionExplanation?: string;
}

interface DrugActivity {
  _id: number;
  hasUsed: boolean; // (If NO, proceed to 23.2)
  hasInvolvement: boolean; // (If NO, proceed to 23.3)
  illegalWhileProcessing: boolean; // (If NO, proceed to 23.4)
  usedWhilePublicSaftey: boolean; // (If NO, proceed to 23.5)
  usedNotPerscribed: boolean; // (If NO, proceed to 23.6)
  suggestedCounsoling: boolean; // (If NO, proceed to 23.7)
  voluntaryCounsoling: boolean;
  section23_1?: Section23_1[];
  section23_2?: Section23_2[];
  section23_3?: Section23_3[];
  section23_4?: Section23_4[];
  section23_5?: Section23_5[];
  section23_6?: Section23_6[];
  section23_7?: Section23_7[];
}

export type {
  DateInfo,
  DateRange,
  Address,
  TreatmentProvider,
  TreatmentProviderPhone,
  DrugActivity,
  Section23_1,
  Section23_2,
  Section23_3,
  Section23_4,
  Section23_5,
  Section23_6,
  Section23_7,
};
