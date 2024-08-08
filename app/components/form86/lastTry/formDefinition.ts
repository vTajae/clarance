import { CitizenshipNaturalizationInfo } from "api_v2/interfaces/Citizenship";
import { DualCitizenshipFormData } from "api_v2/interfaces/DuelCitizenship";
import { ApplicantResidency } from "api_v2/interfaces/Residency";
import { EmploymentInfo } from "api_v2/interfaces/employmentInfo";
import { ForeignActivities } from "api_v2/interfaces/foreignActivities";
import { ForeignContacts } from "api_v2/interfaces/foreignContacts";
import { MilitaryHistoryInfo } from "api_v2/interfaces/militaryHistoryInfo";
import { PeopleThatKnow } from "api_v2/interfaces/peopleThatKnow";
import { RelationshipInfo } from "api_v2/interfaces/relationshipInfo";
import { RelativesInfo } from "api_v2/interfaces/relativesInfo";
import { SchoolInfo } from "api_v2/interfaces/schoolInfo";
import { MentalHealth } from "api_v2/interfaces/mentalHealth";
import { PoliceRecord } from "api_v2/interfaces/policeRecord";
import { DrugActivity } from "api_v2/interfaces/drugsActivity";
import { AlcoholUse } from "api_v2/interfaces/alcoholUse";
import { InvestigationsInfo } from "api_v2/interfaces/InvestigationsInfo";
import { Finances } from "api_v2/interfaces/finances";
import { Technology } from "api_v2/interfaces/technology";
import { Association } from "api_v2/interfaces/association";
import { Civil } from "api_v2/interfaces/civil";
import { Signature } from "api_v2/interfaces/signature";

export enum QuestionType {
  Text = "text",
  Checkbox = "checkbox",
  Dropdown = "dropdown",
  Radio = "radio",
  Date = "date",
}

export type AnswerValue = string | boolean | undefined;

interface FormQuestionCondition {
  dependsOn: string;
  equals: boolean | string;
}

interface FormQuestion {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // For dropdowns
  enumKey?: keyof typeof EnumMappings; // Reference to enums for dropdowns
  condition?: FormQuestionCondition;
}

interface FormSection {
  id: string;
  title: string;
  questions: FormQuestion[];
}

interface FormConfig {
  formSections: FormSection[];
}

enum SuffixOptions {
  MakeASelection = "Make A Selection",
  Jr = "Jr.",
  Sr = "Sr.",
  III = "III",
  IV = "IV",
  None = "None", // Assuming you want to give an option for no suffix
}

enum YesNo {
  true = "Yes",
  false = "No",
}

// StateOptions.ts
enum StateOptions {
  MakeASelection = "Make A Selection",
  NY = "New York",
  CA = "California",
  // Add more states
}

enum Gender {
  NA = "Make A Selection",
  M = "Male",
  F = "Female",
  Other = "Other",
  // Add more states
}

// Mapping enums to keys
export const EnumMappings = {
  SuffixOptions,
  StateOptions,
  Gender,
  YesNo,
};

// Form data structure
interface FormAnswers {
  [key: string]: AnswerValue; // Keys are question IDs, values are answers
}

interface ApplicantPersonalInfo {
  applicantID?: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
}

interface ApplicantAknowledgeInfo {
  ssn?: string;
  notApplicable: boolean;
}

interface ApplicantFormValues {
  personalInfo: ApplicantPersonalInfo;
  namesInfo: NamesInfo;
  aknowledgementInfo: ApplicantAknowledgeInfo;
  birthInfo: ApplicantBirthInfo;
  physicalAttributes: ApplicantPhysicalAttributes;
  contactInfo: ApplicantContactInfo;
  passportInfo: ApplicantPassportInfo;
  citizenshipInfo: CitizenshipNaturalizationInfo;
  dualCitizenshipInfo: DualCitizenshipFormData;
  residencyInfo: ApplicantResidency[];
  employmentInfo: EmploymentInfo[];
  schoolInfo: SchoolInfo;
  serviceInfo: ServiceInfo;
  militaryHistoryInfo: MilitaryHistoryInfo;
  peopleThatKnow: PeopleThatKnow[];
  relationshipInfo: RelationshipInfo;
  relativesInfo: RelativesInfo;
  foreignContacts: ForeignContacts;
  foreignActivities: ForeignActivities;
  mentalHealth: MentalHealth;
  policeRecord: PoliceRecord;
  drugActivity: DrugActivity;
  alcoholUse: AlcoholUse;
  investigationsInfo: InvestigationsInfo;
  finances: Finances;
  technology: Technology;
  civil: Civil;
  association: Association;
  signature: Signature;
  print: boolean;
}

interface ServiceInfo {
  bornAfter1959: boolean | null; // null to represent unanswered state
  registeredWithSSS: "yes" | "no" | "dontKnow" | null; // null to represent unanswered state
  registrationNumber?: string; // Optional, only required if registeredWithSSS is 'yes'
  explanation?: string; // Optional, only required if registeredWithSSS is 'no' or 'dontKnow'
}

interface NamesInfo {
  hasNames: boolean;
  names: ApplicantNames[];
}

interface ApplicantNames {
  _id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  nameStarted: Date | string;
  isStartDateEst: boolean;
  nameEnded: Date | string;
  isNamePresent: boolean;
  isEndDateEst: boolean;
  isMaidenName: boolean;
  reasonChanged: string;
}

interface ApplicantBirthInfo {
  birthDate: string;
  isBirthDateEstimate: boolean;
  birthCity: string;
  birthState: string;
  birthCountry: string;
}

interface ApplicantPhysicalAttributes {
  heightFeet: number;
  heightInch: number;
  weight: number;
  hairColor: string;
  eyeColor: string;
}

interface ApplicantContactNumber {
  _id: number;
  numberType: "Home" | "Work" | "Cell"; // Assuming these are the three types
  phoneNumber: string;
  phoneExtension: string;
  isUsableDay: boolean;
  isUsableNight: boolean;
  internationalOrDSN: boolean;
}

interface ApplicantContactInfo {
  homeEmail: string;
  workEmail: string;
  contactNumbers: ApplicantContactNumber[];
}

interface ApplicantPassportInfo {
  passportNum: string;
  issueDate: string;
  isIssuedEst: boolean;
  expirationDate: string;
  isExpirationEst: boolean;
  passportLName: string;
  passportFName: string;
  passportMName: string;
  passportSuffix: string;
  hasPassport: boolean;
}

interface ApplicantDocuments {
  docID: number;
  docType: string;
  docNum: string;
  docIssueDate: string;
  isDocDateEst: boolean;
  docExpireDate: string;
  isDocExpirationEst: boolean;
  docIssuerLName: string;
  docIssuerFName: string;
  docIssuerMName: string;
  docIssuerSuffix: string;
  documentIssued: string;
  otherDoc: string;
}

interface ApplicantContacts {
  contactID: number;
  contactSurname: string;
  contactFirstname: string;
  contactMiddlename: string;
  contactSuffix: string;
  lastContactDate: string;
  isLastContactEst: boolean;
  contactRelationship: string;
  relationshipOtherDetail: string;
  phoneType: string;
  knowsNumber: boolean;
  isInternationalOrDSN: boolean;
  phoneNumber: string;
  phoneExtension: string;
  hasEmail: boolean;
  contactEmail: string;
  contactStreet: string;
  contactCity: string;
  Zip: string;
  contactCountry: string;
  contactAPOFPO: boolean;
  contactAPOFPOAddress: string;
}

export type {
  FormConfig,
  FormAnswers,
  FormQuestion,
  FormSection,
  NamesInfo,
  FormQuestionCondition,
  ApplicantFormValues,
  ApplicantDocuments,
  ApplicantContacts,
  ApplicantContactNumber,
  ApplicantPersonalInfo,
  ApplicantAknowledgeInfo,
  ApplicantNames,
  ApplicantBirthInfo,
  ApplicantPhysicalAttributes,
  ApplicantContactInfo,
  ApplicantPassportInfo,
  ServiceInfo,
};
