interface Location_Type {
    location_type_id: number;
    _description: string;
  }

  interface ClearanceStatus_Type {
    clearance_status_id: number;
    clearance_status_name: string;
  }

  interface Clearance_Type {
    clearance_id: number;
    clearance_name: string;

  }

  enum SuffixOptions {
    MakeASelection = "Make A Selection",
    Jr = "Jr.",
    Sr = "Sr.",
    III = "III",
    IV = "IV",
    None = "None", // Assuming you want to give an option for no suffix
  }

  export interface FormClearance {
    clearanceNames: Clearance_Type[]
    clearanceTypes: ClearanceStatus_Type[];
  }

  interface FormInfo {
    clearances: FormClearance;
    locations: Location_Type[];
    employee_id: number;
    suffix: SuffixOptions;
  }


  export default FormInfo;