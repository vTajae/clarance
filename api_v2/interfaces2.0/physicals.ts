import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ApplicantPhysicalAttributes {
    heightFeet: Field<string>;
    heightInch: Field<string>;
    weight: Field<string>;
    hairColor: Field<string>;
    eyeColor: Field<string>;
    gender: Field<string>;
  }

  export type { ApplicantPhysicalAttributes };