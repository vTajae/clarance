
  
  interface PeopleThatKnow {
    _id: number;
    knownFromDate: string; // Assuming format 'MM/YYYY'
    knownToDate: string | null; // null if still known
    present: boolean; // true if still known
    estimatedFromDate: boolean;
    estimatedToDate: boolean;
    lastName: string;
    firstName: string;
    middleName?: string; // Optional
    suffix?: string; // Optional
    emailAddress?: string; // Optional
    emailUnknown: boolean; // true if email is unknown
    rankOrTitle?: string; // Optional
    rankOrTitleNotApplicable: boolean; // true if rank/title is not applicable
    relationshipToApplicant: {
      neighbor: boolean;
      workAssociate: boolean;
      friend: boolean;
      schoolmate: boolean;
      other?: string; // Optional, explanation for other relationship
    };
    phoneNumber?: string; // Optional
    phoneNumberUnknown: boolean; // true if phone number is unknown
    phoneExtension?: string; // Optional
    phoneType?: 'International' | 'DSN'; // Optional
    mobileNumber?: string; // Optional
    preferredContactTime: {
      day: boolean;
      night: boolean;
    };
    address: Address;
  }
  
  interface Address {
    street: string;
    city: string;
    state?: string; // Optional, if applicable
    zipCode?: string; // Optional, if applicable
    country: string;
  }
  
  export type {PeopleThatKnow}