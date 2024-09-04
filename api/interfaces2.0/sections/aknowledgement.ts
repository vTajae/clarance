import { Field } from "../formDefinition";

interface AknowledgeInfo {
  aknowledge: Field<"YES" | "NO">;
  ssn?: Field<string>;
  notApplicable: Field<"Yes" | "No">;
}

export type { AknowledgeInfo };
