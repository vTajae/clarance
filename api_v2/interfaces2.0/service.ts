import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

interface ServiceInfo {
    bornAfter1959: Field<"YES" | "NO">; // null to represent unanswered state
    registeredWithSSS: Field<"YES" | "NO" | "dontKnow">; // null to represent unanswered state
    registrationNumber?: Field<string>; // Optional, only required if registeredWithSSS is 'yes'
    explanation?: Field<string>; // Optional, only required if registeredWithSSS is 'no' or 'dontKnow'
  }

  export type { ServiceInfo };