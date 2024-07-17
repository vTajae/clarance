interface ForeignActivities {
  _id: number;
  hasForeignFinancialInterest: boolean; // If not go to A.2
  hasForeignInterestOnBehalf: boolean; // If not go to A.3
  wantForeignRealEstate: boolean; // If not go to A.4
  hasForeignSupport: boolean; // If not go to A.5
  providedForeignSupport: boolean; // If not go to B
  providedForeignAdvice: boolean; // If not go to B.2
  familyProvidedForeignAdvice: boolean; // If not go to B.3
  offeredForeignJob: boolean; // If not go to B.4
  offeredBuisnessVenture: boolean; // If not go to B.5
  foreignConferences: boolean; // If not go to B.6
  contactForeignGovernment: boolean; // If not go to B.7
  sponsoredForeignNational: boolean; // If not go to B.8
  foreignPoliticalOffice: boolean; // If not go to B.9
  foreignVote: boolean; // If not go to C
  traveledOutsideUSA: boolean;
  traveledOutsideUSA_Government: boolean;
  section20A1?: Section20A1[];
  section20A2?: Section20A2[];
  section20A3?: Section20A3[];
  section20A4?: Section20A4[];
  section20A5?: Section20A5[];
  section20B1?: Section20B1[];
  section20B2?: Section20B2[];
  section20B3?: Section20B3[];
  section20B4?: Section20B4[];
  section20B5?: Section20B5[];
  section20B6?: Section20B6[];
  section20B7?: Section20B7[];
  section20B8?: Section20B8[];
  section20B9?: Section20B9[];
  section20C?: Section20C;
}

interface Section20A1 {
  id_: number;
  ownershipType: OwnershipType[];
  financialInterestType: string;
  dateAcquired: DateInfo;
  howAcquired: string;
  costAtAcquisition: ValueInfo;
  currentValue: ValueInfo;
  dateControlRelinquished: DateInfo;
  disposalExplanation: string;
  hasCoOwners: boolean;
  coOwners?: CoOwner[];
}

interface Section20A2 {
  id_: number;
  ownershipType: OwnershipType[];
  financialInterestType: string;
  controllerInfo: IndividualInfo;
  dateAcquired: DateInfo;
  costAtAcquisition: ValueInfo;
  currentValue: ValueInfo;
  dateDisposed: DateInfo;
  disposalExplanation: string;
  hasCoOwners: boolean;
  coOwners?: CoOwner[];
}

interface Section20A3 {
  id_: number;
  ownershipType: OwnershipType[];
  realEstateType: string;
  location: Address;
  dateOfPurchase: DateInfo;
  howAcquired: string;
  dateSold: DateInfo;
  costAtAcquisition: ValueInfo;
  hasCoOwners: boolean;
  coOwners?: CoOwner[];
}

interface Section20A4 {
  id_: number;
  ownershipType: OwnershipType[];
  benefitType: BenefitType;
  benefitFrequency: BenefitFrequency;
  oneTimeBenefit?: BenefitDetail;
  futureBenefit?: BenefitDetail;
  continuingBenefit?: BenefitDetail;
}

interface OwnershipType {
  _id: number;
  type:
    | "Yourself"
    | "Spouse or legally recognized civil union/domestic partner"
    | "Cohabitant"
    | "Dependent children"; // Educational, Medical, Retirement, Social Welfare, etc.
}

interface Section20A5 {
  id_: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  address: Address;
  relationship: string;
  amountProvided: ValueInfo;
  citizenships: Citizenships[];
  frequency: Frequency;
}

interface Section20B1 {
  id_: number;
  description: string;
  individual: IndividualInfo;
  organization: string;
  organizationCountry: string;
  dateFrom: DateInfo;
  dateTo: DateInfo;
  compensation?: string;
}

interface Section20B2 {
  id_: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  agency: string;
  country: string;
  dateOfRequest: DateInfo;
  circumstances: string;
}

interface Section20B3 {
  id_: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  positionDescription: string;
  dateOffered: DateInfo;
  accepted: boolean;
  explanation?: string;
  location: Address;
}

interface Section20B4 {
  id_: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  address: Address;
  citizenships: Citizenships[];
  ventureDescription: string;
  dateFrom: DateInfo;
  dateTo: DateInfo;
  natureOfAssociation: string;
  positionHeld: string;
  financialSupport: ValueInfo;
  compensationDescription: string;
}

interface Section20B5 {
  id_: number;
  eventDescription: string;
  eventDates: EventDateInfo;
  purpose: string;
  sponsoringOrganization: string;
  eventLocation: Address;
  hasContacts: boolean;
  subsequentContacts?: SubsequentContact[];
}

interface Section20B6 {
  id_: number;
  individual: IndividualInfo;
  contactLocation: Address;
  contactDate: DateInfo;
  establishmentType: string;
  foreignRepresentatives: string;
  purposeCircumstances: string;
  hasContact: boolean;
  subsequentContact?: SubsequentContactDetail[];
}

interface Section20B7 {
  id_: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  dateOfBirth: DateInfo;
  placeOfBirth: Address;
  currentAddress: Address;
  citizenships: Citizenships[];
  sponsoringOrganization: OrganizationInfo;
  datesOfStay: EventDateInfo;
  addressDuringStay: Address;
  purposeOfStay: string;
  purposeOfSponsorship: string;
}

interface OrganizationInfo {
  name: string;
  notApplicable: boolean;
  address: Address;
}

interface Section20B8 {
  id_: number;
  positionHeld: string;
  datesHeld: EventDateInfo;
  reasonForActivities: string;
  currentEligibility: string;
  countryInvolved: string;
}

interface Section20B9 {
  id_: number;
  dateVoted: DateInfo;
  countryInvolved: string;
  reasons: string;
  currentEligibility: string;
}

interface Section20C {
  id_: number;
  countryVisited: string;
  travelDates: EventDateInfo;
  numberOfDays: Days[];
  purposeOfTravel: Purpose[];
  questionedOrSearched: boolean;
  questionedOrSearchedExplanation?: string;
  encounterWithPolice: boolean;
  encounterWithPoliceExplanation?: string;
  contactWithForeignIntelligence: boolean;
  contactWithForeignIntelligenceExplanation?: string;
  counterintelligenceIssues: boolean;
  counterintelligenceIssuesExplanation?: string;
  contactExhibitingInterest: boolean;
  contactExhibitingInterestExplanation?: string;
  contactAttemptingToObtainInfo: boolean;
  contactAttemptingToObtainInfoExplanation?: string;
  threatenedOrCoerced: boolean;
  threatenedOrCoercedExplanation?: string;
}

interface Days {
  _id: number;
  option:
    | "1-5"
    | "6-10"
    | "11-20"
    | "21-30"
    | "More than 30"
    | "Many short trips";
}

interface Purpose {
  _id: number;
  reason:
    | "Visit family or friends"
    | "Trade shows, conferences, and seminars"
    | "Education Tourism"
    | "Volunteer activities"
    | "Business/Professional conference"
    | "Other";
}

interface DateInfo {
  date: string; // Month/Day/Year
  estimated: boolean;
}

interface ValueInfo {
  value: number;
  estimated: boolean;
}

interface EventDateInfo {
  fromDate: DateInfo;
  toDate: DateInfo;
  present: boolean;
}

interface IndividualInfo {
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  relationship: string;
}

interface CoOwner {
  _id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  suffix?: string;
  address: Address;
  citizenships: Citizenships[];
  relationship: string;
}

interface Citizenships {
  _id: number;
  type: string;
  notApplicable?: boolean;
}

interface Address {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

interface BenefitType {
  _id: number;
  type: "Educational" | "Medical" | "Retirement" | "Social Welfare" | "Other";
  other?: string;
}

interface BenefitDetail {
  dateReceived: DateInfo;
  countryProviding: string;
  totalValue: ValueInfo;
  reason: string;
  obligatedToForeignCountry: boolean;
  explanation?: string;
  frequency?: Frequency;
}

interface Frequency {
  _id: number;
  type: "Annually" | "Monthly" | "Quarterly" | "Weekly" | "Other";
  other?: string;
}

interface BenefitFrequency {
  type: "Onetime benefit" | "Future benefit" | "Continuing benefit" | "Other";
  other?: string;
}

interface SubsequentContact {
  _id: number;
  contactExplanation: string;
}

interface SubsequentContactDetail {
  _id: number;
  purpose: string;
  dateOfMostRecentContact: DateInfo;
  plansForFutureContact: string;
}

export type {
  ForeignActivities,
  Section20A1,
  Section20A2,
  Section20A3,
  Section20A4,
  Section20A5,
  Section20B1,
  Section20B2,
  Section20B3,
  Section20B4,
  Section20B5,
  Section20B6,
  Section20B7,
  Section20B8,
  Section20B9,
  Section20C,
  OwnershipType,
  DateInfo,
  ValueInfo,
  EventDateInfo,
  IndividualInfo,
  CoOwner,
  Address,
  BenefitType,
  BenefitDetail,
  Frequency,
  SubsequentContact,
  SubsequentContactDetail,
};
