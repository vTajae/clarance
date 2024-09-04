import { Field } from "api/interfaces2.0/formDefinition";

interface PersonalInfo {
    applicantID?: string;
    lastName: Field<string>;
    firstName: Field<string>;
    middleName: Field<string>;
    suffix: Field<string>;
  }

  export type { PersonalInfo };