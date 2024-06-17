
interface CitizenshipNaturalizationInfo {
  citizenship_status_code: 'birth' | 'naturalized' | 'derived' | 'nonCitizen' | 'citizen'| 'None';
  details?: CitizenshipByBirthInfo | NaturalizedCitizenInfo | DerivedCitizenInfo | NonCitizenInfo;
}

// Specific Information Interfaces for Each Citizenship Status
interface CitizenshipByBirthInfo {
  doc_type: 'FS240' | 'DS1350' | 'FS545' | 'Other';
  other_doc?: string;
  doc_num: string;
  doc_issue_date: string;
  is_issue_date_est: boolean;
  issue_city: string;
  issued_state?: string;
  issued_country?: string;
  issued_fname: string;
  issued_lname: string;
  issued_mname?: string;
  issued_suffix?: string;
  citizenship_num?: string;
  certificate_issue_date?: string;
  is_certificate_date_est?: boolean;
  certificate_fname?: string;
  certificate_lname?: string;
  certificate_mname?: string;
  certificate_suffix?: string;
  is_born_installation?: boolean;
  base_name?: string;
}

interface NaturalizedCitizenInfo {
  us_entry_date: string;
  is_us_entry_date_est: boolean;
  entry_city: string;
  entry_state: string;
  country_of_citizenship_1: string; // Country #1
  country_of_citizenship_2: string; // Country #2
  has_alien_registration: boolean;
  alien_registration_num?: string;
  naturalization_num: string;
  naturalization_issue_date: string;
  is_natural_issue_est: boolean;
  court_issued_date: string;
  court_street: string;
  court_city: string;
  court_state: string;
  court_zip: string;
  court_issued_fname: string;
  court_issued_lname: string;
  court_issued_mname?: string;
  court_issued_suffix?: string;
  basis_of_naturalization?: string;
  other_basis_detail?: string;
}

interface DerivedCitizenInfo {
  alien_registration_num?: string;
  permanent_resident_num?: string;
  certificate_of_citizenship_num?: string;
  doc_fname: string;
  doc_lname: string;
  doc_mname?: string;
  doc_suffix?: string;
  doc_issue_date: string;
  is_doc_date_est: boolean;
  basis_of_citizenship: 'other' | 'byOp';
  basis_of_citizenship_explanation?: string;
}

interface NonCitizenInfo {
  residence_status: string;
  us_entry_date: string;
  is_entry_date_est: boolean;
  country_of_citizenship1: string;
  country_of_citizenship2?: string;
  entry_city: string;
  entry_state: string;
  alien_registration_num: string;
  expiration_date: string;
  is_expiration_est: boolean;
  document_issued: 'I-94' | 'U.S. Visa' | 'I-20' | 'DS-2019' | 'Other';
  other_doc?: string;
  doc_num: string;
  doc_issued_date: string;
  is_doc_date_est: boolean;
  doc_expire_date: string;
  is_doc_expiration_est: boolean;
  doc_fname: string;
  doc_lname: string;
  doc_mname?: string;
  doc_suffix?: string;
}

export type {
  CitizenshipNaturalizationInfo,
  CitizenshipByBirthInfo,
  NaturalizedCitizenInfo,
  DerivedCitizenInfo,
  NonCitizenInfo,
};
