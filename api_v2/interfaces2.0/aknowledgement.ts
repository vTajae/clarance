import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ApplicantAknowledgeInfo {
  aknowledge: Field<"YES" | "NO">;
  ssn?: Field<string>;
  notApplicable: Field<"YES" | "NO">;
}

export type { ApplicantAknowledgeInfo };
