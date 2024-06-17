import { Phone } from "./Residency";

interface SchoolInfo {
  hasAttendedSchool: boolean;
  hasReceivedDegree: boolean;
  schoolEntry: SchoolData[];
}

interface SchoolData {
  _id: number;
  fromDate: string;
  toDate: string;
  present: boolean;
  est: boolean;
  schoolName: string;
  schoolAddress: Address;
  schoolType: string;
  knownPerson: KnownPerson;
  degreeReceived: boolean;
  degrees: Degree[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface KnownPerson {
  firstName: string;
  lastName: string;
  address: Address;
  phoneNumber: Phone;
  email: string;
  unknown: boolean;
}

interface Degree {
  _id: number;
  type: string;
  dateAwarded: string;
  est: boolean;
}

export type { SchoolInfo, SchoolData, Address, Degree, KnownPerson, Phone };
