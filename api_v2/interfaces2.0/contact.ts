import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ApplicantContactNumber {
  _id: number;
  numberType: Field<"Home" | "DSN" | "International">; // Assuming these are the three types
  phoneNumber: Field<string>;
  phoneExtension: Field<string>;
  isUsableDay: Field<"YES" | "NO">;
  isUsableNight: Field<"YES" | "NO">;
  internationalOrDSN: Field<"YES" | "NO">;
}

interface ApplicantContactInfo {
  homeEmail: Field<string>;
  workEmail: Field<string>;
  contactNumbers: ApplicantContactNumber[];
}

export type { ApplicantContactInfo, ApplicantContactNumber };