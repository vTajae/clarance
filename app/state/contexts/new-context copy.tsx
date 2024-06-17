import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import pkg from "lodash";
import { ApplicantFormValues } from "~/components/form86/lastTry/formDefinition";
import DynamicService from "../../../api_v2/service/dynamicService";

const { set, isEqual, cloneDeep } = pkg;

interface EmployeeContextType {
  data: ApplicantFormValues;
  loadEmployee: () => Promise<void>;
  resetForm: () => void;
  isLoading: boolean;
  updateField: (path: string, value: string) => void; // Updates fileds in form all fields are string.
  getChanges: () => any; // returns a model of {added: {}, modified: {}, deleted: {}} with changes inside according to each delta
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }
  return context;
};

interface EmployeeProviderProps {
  children: ReactNode;
}

const defaultFormData: ApplicantFormValues = {
  personalInfo: {
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
  },
  birthInfo: {
    birthDate: "None",
    isBirthDateEstimate: false,
    birthCity: "",
    birthState: "",
    birthCountry: "",
  },
  aknowledgementInfo: {
    notApplicable: false,
  },
  namesInfo: {
    hasNames: false,
    names: [],
  },
  physicalAttributes: {
    heightFeet: 0,
    heightInch: 0,
    weight: 0,
    hairColor: "None",
    eyeColor: "None",
  },
  contactInfo: {
    homeEmail: "",
    workEmail: "",
    contactNumbers: [
      {
        contactNumberID: Math.random(),
        numberType: "Home", // Default type, can be changed by the user
        phoneNumber: "",
        phoneExtension: "",
        isUsableDay: false,
        isUsableNight: false,
        internationalOrDSN: false, // As
      },
    ],
  },
  passportInfo: {
    passportNum: "",
    issueDate: "",
    isIssuedEst: false,
    expirationDate: "",
    isExpirationEst: false,
    passportLName: "",
    passportFName: "",
    passportMName: "",
    passportSuffix: "",
    hasPassport: false,
  },
  citizenshipInfo: {
    citizenship_status_code: "None",
  },
  dualCitizenshipInfo: {
    heldMultipleCitizenships: false,
    citizenships: [],
    hadNonUSPassport: false,
    passports: [],
  },
  residencyInfo: [],

  contacts: [],
};

export const EmployeeProvider2: React.FC<EmployeeProviderProps> = ({
  children,
}) => {
  const [initialData, setInitialData] =
    useState<ApplicantFormValues>(defaultFormData);
  const [updatedData, setUpdatedData] =
    useState<ApplicantFormValues>(defaultFormData);

  const [isLoading, setLoading] = useState(true); // Manage loading state

  const resetForm = () => {
    setUpdatedData(defaultFormData); // Reset to default form data
  };

  const loadEmployee = useCallback(async () => {
    const dynamicService = new DynamicService();
    const employee = await dynamicService.loadUserFormData("applicantData");

    if (initialData === defaultFormData && employee.formData) {
      // console.log(employee, "employee");

      setInitialData(employee.formData);
      setUpdatedData(employee.formData);
    }
    setLoading(false);
  }, [initialData]); // Fix: Add an empty array as the second argument

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  const updateField = (path: string, value: any) => {
    setUpdatedData((prev) => {
      const updated = cloneDeep(prev); // Deep clone the previous state
      set(updated, path, value);
      return updated;
    });
  };



  const getChanges = () => {
    const changes: {
      added: any;
      modified: any;
      deleted: any;
    } = {
      added: {},
      modified: {},
      deleted: {},
    };
  
    console.log("Initial data:", initialData.residencyInfo);
    console.log("Updated data:", updatedData.residencyInfo);
  
    const compareObjectsForModifications = (base: any, updated: any): any => {
      const modified: any = {};
      const keysToAlwaysInclude: string[] = []; // Add more keys as needed
  
      Object.keys(updated).forEach((key: string) => {
        if (!isEqual(base[key], updated[key]) || keysToAlwaysInclude.includes(key)) {
          modified[key] = updated[key];
        }
      });
  
      return modified;
    };
  
    const compareArrays = (
      base: any[],
      updated: any[],
      idKey: string,
      arrayName: string
    ) => {
      const baseMap = new Map(base.map((item: any) => [item[idKey], item]));
      const updatedMap = new Map<string, any>();
      const newEntries: any[] = [];
  
      updated.forEach((item: any) => {
        if (item[idKey] !== undefined) {
          updatedMap.set(item[idKey], item);
        } else {
          newEntries.push(item);
        }
      });
  
      console.log(`Base Map for ${arrayName}:`, baseMap);
      console.log(`Updated Map for ${arrayName}:`, updatedMap);
      console.log(`New Entries for ${arrayName}:`, newEntries);
  
      const added: any[] = [];
      const modified: any[] = [];
      const deleted: any[] = [];
  
      // Identify added and modified entries
      for (const [id, updatedItem] of updatedMap.entries()) {
        if (!baseMap.has(id)) {
          console.log(`Adding new item with ID ${id}: ${JSON.stringify(updatedItem)}`);
          added.push(updatedItem); // Entire new entry is added
        } else {
          const baseItem = baseMap.get(id);
          if (!isEqual(baseItem, updatedItem)) {
            console.log(`Modifying item with ID ${id}: ${JSON.stringify(updatedItem)}`);
            modified.push(updatedItem); // Only modified fields are included in modified
          } else {
            console.log(`No change for item with ID ${id}`);
          }
        }
      }
  
      // Identify new entries (shouldn't filter out any fields)
      newEntries.forEach((item) => {
        console.log(`Adding new entry: ${JSON.stringify(item)}`);
        added.push(item);
      });
  
      // Identify deleted entries
      for (const [id, baseItem] of baseMap.entries()) {
        if (!updatedMap.has(id)) {
          console.log(`Deleting item with ID ${id}: ${JSON.stringify(baseItem)}`);
          deleted.push(baseItem);
        }
      }
  
      if (added.length > 0) {
        changes.added[arrayName] = added;
      }
      if (modified.length > 0) {
        changes.modified[arrayName] = modified;
      }
      if (deleted.length > 0) {
        changes.deleted[arrayName] = deleted;
      }
    };
  
    // Special case handling for initially empty arrays
    if (initialData.residencyInfo.length === 0 && updatedData.residencyInfo.length > 0) {
      console.log("Initial residencyInfo was empty, tracking all new entries.");
      changes.added.residencyInfo = updatedData.residencyInfo;
    } else {
      compareArrays(
        initialData.residencyInfo || [],
        updatedData.residencyInfo || [],
        "residenceID",
        "residencyInfo"
      );
    }
  
    const personalInfoModifications = compareObjectsForModifications(
      initialData.personalInfo,
      updatedData.personalInfo
    );
  
    const birthInfoModifications = compareObjectsForModifications(
      initialData.birthInfo,
      updatedData.birthInfo
    );
  
    const contactInfoModifications = compareObjectsForModifications(
      initialData.contactInfo,
      updatedData.contactInfo
    );
  
    const citizenshipInfoModifications = compareObjectsForModifications(
      initialData.citizenshipInfo,
      updatedData.citizenshipInfo
    );
  
    const dualcitizenshipInfoModifications = compareObjectsForModifications(
      initialData.dualCitizenshipInfo,
      updatedData.dualCitizenshipInfo
    );
  
    if (Object.keys(personalInfoModifications).length > 0) {
      changes.modified.personalInfo = personalInfoModifications;
    }
  
    if (Object.keys(birthInfoModifications).length > 0) {
      changes.modified.birthInfo = birthInfoModifications;
    }
  
    if (Object.keys(contactInfoModifications).length > 0) {
      changes.modified.contactInfo = contactInfoModifications;
    }
  
    if (Object.keys(citizenshipInfoModifications).length > 0) {
      changes.modified.citizenshipInfo = citizenshipInfoModifications;
    }
  
    if (Object.keys(dualcitizenshipInfoModifications).length > 0) {
      changes.modified.dualCitizenshipInfo = dualcitizenshipInfoModifications;
    }
  
    console.log(changes, "changes in context");
  
    return changes;
  };
  
  
  return (
    <EmployeeContext.Provider
      value={{
        data: updatedData,
        loadEmployee,
        isLoading,
        updateField,
        resetForm,
        getChanges,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
