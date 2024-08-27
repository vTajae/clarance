import { AlcoholUse } from "api_v2/interfaces2.0/alcoholUse";
import { Association } from "api_v2/interfaces2.0/association";
import { CitizenshipNaturalizationInfo } from "api_v2/interfaces2.0/citizenship";
import { Civil } from "api_v2/interfaces2.0/civil";
import { DrugActivity } from "api_v2/interfaces2.0/drugsActivity";
import { DualCitizenshipFormData } from "api_v2/interfaces2.0/duelCitizenship";
import { EmploymentInfo } from "api_v2/interfaces2.0/employmentInfo";
import { Finances } from "api_v2/interfaces2.0/finances";
import { ForeignActivities } from "api_v2/interfaces2.0/foreignActivities";
import { ForeignContacts } from "api_v2/interfaces2.0/foreignContacts";
import { InvestigationsInfo } from "api_v2/interfaces2.0/InvestigationsInfo";
import { MentalHealth } from "api_v2/interfaces2.0/mentalHealth";
import { MilitaryHistoryInfo } from "api_v2/interfaces2.0/militaryHistoryInfo";
import { PeopleThatKnow } from "api_v2/interfaces2.0/peopleThatKnow";
import { PoliceRecord } from "api_v2/interfaces2.0/policeRecord";
import { RelationshipInfo } from "api_v2/interfaces2.0/relationshipInfo";
import { RelativesInfo } from "api_v2/interfaces2.0/relativesInfo";
import { ApplicantResidency } from "api_v2/interfaces2.0/residency";
import { SchoolInfo } from "api_v2/interfaces2.0/schoolInfo";
import { Signature } from "api_v2/interfaces2.0/signature";
import { Technology } from "api_v2/interfaces2.0/technology";
import { NamesInfo } from "api_v2/interfaces2.0/namesInfo";
import { ApplicantPersonalInfo } from "api_v2/interfaces2.0/personalInfo";
import { ServiceInfo } from "api_v2/interfaces2.0/service";
import { ApplicantContactInfo } from "api_v2/interfaces2.0/contact";
import { ApplicantPassportInfo } from "api_v2/interfaces2.0/passport";
import { ApplicantPhysicalAttributes } from "api_v2/interfaces2.0/physicals";
import { ApplicantBirthInfo } from "api_v2/interfaces2.0/birthnfo";
import { ApplicantAknowledgeInfo } from "api_v2/interfaces2.0/aknowledgement";

interface Field<T> {
  value: T;
  id: string;
  type: string;
}

interface ApplicantFormValues {
  personalInfo: ApplicantPersonalInfo;
  namesInfo: NamesInfo;
  aknowledgementInfo?: ApplicantAknowledgeInfo;
  birthInfo?: ApplicantBirthInfo;
  physicalAttributes?: ApplicantPhysicalAttributes;
  contactInfo?: ApplicantContactInfo;
  passportInfo?: ApplicantPassportInfo;
  citizenshipInfo?: CitizenshipNaturalizationInfo;
  dualCitizenshipInfo?: DualCitizenshipFormData;
  residencyInfo?: ApplicantResidency[];
  employmentInfo?: EmploymentInfo;
  schoolInfo?: SchoolInfo;
  serviceInfo?: ServiceInfo;
  militaryHistoryInfo?: MilitaryHistoryInfo;
  peopleThatKnow?: PeopleThatKnow[];
  relationshipInfo?: RelationshipInfo;
  relativesInfo?: RelativesInfo;
  foreignContacts?: ForeignContacts;
  foreignActivities?: ForeignActivities;
  mentalHealth?: MentalHealth;
  policeRecord?: PoliceRecord;
  drugActivity?: DrugActivity;
  alcoholUse?: AlcoholUse;
  investigationsInfo?: InvestigationsInfo;
  finances?: Finances;
  technology?: Technology;
  civil?: Civil;
  association?: Association;
  signature?: Signature;
  print?: Field<"YES" | "NO">;
}

export type { Field, ApplicantFormValues };
