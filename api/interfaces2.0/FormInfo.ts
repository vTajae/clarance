import { Field } from "~/components/form86/lastTry/formDefinition";


interface Location_Type {
    location_type_id: Field<number>;
    _description: Field<string>;
  }

  interface ClearanceStatus_Type {
    clearance_status_id: Field<number>;
    clearance_status_name: Field<string>;
  }

  interface Clearance_Type {
    clearance_id: Field<number>;
    clearance_name: Field<string>;

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
    employee_id: Field<number>;
    suffix: SuffixOptions;
  }


  export default FormInfo;