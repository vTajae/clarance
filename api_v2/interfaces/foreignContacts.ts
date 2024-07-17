interface ForeignContacts {
    _id: number;
    hasForeignContact: boolean | null; // null to represent unanswered state
    entries: ContactEntry[];
  }
  
  interface ContactEntry {
    _id: number;
    lastName: string;
    firstName: string;
    middleName: string | null;
    suffix: string | null;
    approximateFirstContactDate: string | null; // Format: "MM/YYYY"
    approximateLastContactDate: string | null; // Format: "MM/YYYY"
    contactMethods: ContactMethod[];
    contactFrequency: ContactFrequency[];
    relationshipNature: RelationshipNature[];
    otherNames: NameAlias[];
    citizenships: Citizenship[];
    dateOfBirth: string | null; // Format: "MM/DD/YYYY"
    placeOfBirth: PlaceOfBirth;
    currentAddress: Address | null;
    apoFpoAddress: APOFPOAddress | null;
    currentEmployer: Employer | null;
    affiliatedWithForeignGov: boolean | null;
    foreignGovAffiliationDetails: string | null;
  }
  
  type ContactMethod = 'InPerson' | 'Telephone' | 'Electronic' | 'WrittenCorrespondence' | 'Other';
  type ContactFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Other';
  type RelationshipNature = 'ProfessionalOrBusiness' | 'Personal' | 'Obligation' | 'Other';
  
  interface NameAlias {
    lastName: string;
    firstName: string;
    middleName: string | null;
    suffix: string | null;
  }
  
  interface Citizenship {
    _id: number;
    country: string;
  }
  
  interface PlaceOfBirth {
    city: string | null;
    country: string | null;
  }
  
  interface Address {
    street: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
  }
  
  interface APOFPOAddress {
    address: string | null;
    stateCode: string | null;
    zipCode: string | null;
  }
  
  interface Employer {
    name: string | null;
    address: Address | null;
  }

  
  export type { ForeignContacts, ContactEntry, ContactMethod, ContactFrequency, RelationshipNature, NameAlias, Citizenship, PlaceOfBirth, Address, APOFPOAddress, Employer}