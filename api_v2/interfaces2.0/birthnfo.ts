import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ApplicantBirthInfo {
    birthDate: Field<string>;
    isBirthDateEstimate: Field<"YES" | "NO">;
    birthCity: Field<string>;
    birthCounty: Field<string>;
    birthState: Field<string>;
    birthCountry: Field<string>;
  }

  export type { ApplicantBirthInfo };