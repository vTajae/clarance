import { Field } from "~/components/form86/lastTry/formDefinition copy 2";

  
  interface PeopleThatKnow {
    _id: number;
    knownFromDate: Field<string>; // Assuming format 'MM/YYYY'
    knownToDate: Field<string> | null; // null if still known
    present: Field<"YES" | "NO">; // true if still known
    estimatedFromDate: Field<"YES" | "NO">;
    estimatedToDate: Field<"YES" | "NO">;
    lastName: Field<string>;
    firstName: Field<string>;
    middleName?: Field<string>; // Optional
    suffix?: Field<string>; // Optional
    emailAddress?: Field<string>; // Optional
    emailUnknown: Field<"YES" | "NO">; // true if email is unknown
    rankOrTitle?: Field<string>; // Optional
    rankOrTitleNotApplicable: Field<"YES" | "NO">; // true if rank/title is not applicable
    relationshipToApplicant: {
      neighbor: Field<"YES" | "NO">;
      workAssociate: Field<"YES" | "NO">;
      friend: Field<"YES" | "NO">;
      schoolmate: Field<"YES" | "NO">;
      other?: Field<string>; // Optional, explanation for other relationship
    };
    phoneNumber?: Field<string>; // Optional
    phoneNumberUnknown: Field<"YES" | "NO">; // true if phone Field<number> is unknown
    phoneExtension?: Field<string>; // Optional
    phoneType?: Field<'International' | 'DSN'>; // Optional
    mobileNumber?: Field<string>; // Optional
    preferredContactTime: {
      day: Field<"YES" | "NO">;
      night: Field<"YES" | "NO">;
    };
    address: Address;
  }
  
  interface Address {
    street: Field<string>;
    city: Field<string>;
    state?: Field<string>; // Optional, if applicable
    zipCode?: Field<string>; // Optional, if applicable
    country: Field<string>;
  }
  
  export type {PeopleThatKnow}