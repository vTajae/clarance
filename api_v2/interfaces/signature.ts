interface Section30_1 {
  _id: number;
  fullName: string; // Full name (Type or print legibly)
  dateSigned: string; // Date signed (mm/dd/yyyy)
  otherNamesUsed: string; // Other names used
  address: Address; // Current street address Apt. #
  telephoneNumber: string; // Telephone number
}

interface Section30_2 {
  _id: number;
  fullName: string; // Full name (Type or print legibly)
  dateSigned: string; // Date signed (mm/dd/yyyy)
  otherNamesUsed: string; // Other names used
  address: Address; // Current street address Apt. #
  telephoneNumber: string; // Telephone number
}

interface Section30_3 {
  _id: number;
  fullName: string; // Full name (Type or print legibly)
  dateSigned: string; // Date signed (mm/dd/yyyy)
}

interface Signature {
  _id: number;
  information: boolean;
  medical: boolean;
  credit: boolean;
  section30_1?: Section30_1[];
  section30_2?: Section30_2[];
  section30_3?: Section30_3[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type { Signature, Address, Section30_1, Section30_2, Section30_3 };
