import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ApplicantPersonalInfo {
    applicantID?: string;
    lastName: Field<string>;
    firstName: Field<string>;
    middleName: Field<string>;
    suffix: Field<string>;
  }
  export type { ApplicantPersonalInfo };