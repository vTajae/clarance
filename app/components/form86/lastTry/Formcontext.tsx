
const defaultFormData: ApplicantFormValues = {
  personalInfo: {
    applicantID: "087087807087-Ufuyyyk-8698t97t",
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    gender: "Other",
    isNotApplicable: false,
  },
  aknowledgementInfo: {
    ssn: "",
    aknowledge: false,
  },
  birthInfo: {
    birthDate: "",
    isBirthDateEstimate: false,
    birthCity: "",
    birthState: "",
    birthCountry: "",
  },
  names: [
    {
      nameID: 0,
      hasNames: false,
      lastName: "",
      firstName: "",
      middleName: "",
      suffix: "",
      nameStarted: "",
      isStartDateEst: false,
      nameEnded: "",
      isNamePresent: false,
      isEndDateEst: false,
      isMaidenName: false,
      reasonChanged: "",
    },
    
  ],
  contactInfo: {
    contactID: 0,
    homeEmail: "",
    workEmail: "",
    contactNumbers: [
      {
        numberType: "Home", // Assuming these are the three types
        phoneNumber: "",
        phoneExtension: "",
        isUsableDay: false,
        isUsableNight: false,
      },
    ],
  },
  physicalAttributes: {
    attributeID: 0,
    heightFeet: 0,
    heightInch: 0,
    weight: 0,
    hairColor: "",
    eyeColor: "",
  },
  passportInfo: {
    passportID: 0,
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
    citizenship_status_code: "citizen",
  },
  duelCitizenshipInfo: {
    heldMultipleCitizenships: false,
    hadNonUSPassport: false,
    citizenships: [],
    passports: [],
  },
  residencyInfo: [],
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AnswerValue, ApplicantFormValues, FormConfig } from "./formDefinition";
import myJson from "./data.json";
import { FormUtils } from "./processform";

interface FormContextType {
  formValues: ApplicantFormValues;
  setFormValue: <
    Section extends keyof ApplicantFormValues,
    Field extends keyof ApplicantFormValues[Section]
  >(
    section: Section,
    field: Field,
    value: AnswerValue // No change needed here; the interface update takes care of type compatibility
  ) => void;
  currentStep: number;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  processedFormConfig: FormConfig;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formValues, setFormValues] =
    useState<ApplicantFormValues>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [processedFormConfig, setProcessedFormConfig] = useState<FormConfig>(
    FormUtils.preprocessForm(myJson as FormConfig, formValues)
  );

  useEffect(() => {
    setProcessedFormConfig(
      FormUtils.preprocessForm(myJson as FormConfig, formValues)
    );

    console.log(formValues);
  }, [formValues, currentStep]);

  const setFormValue = <Section extends keyof ApplicantFormValues>(
    section: Section,
    field: keyof ApplicantFormValues[Section],
    value: AnswerValue
  ) => {
    
    setFormValues((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPrevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const submitForm = async () => {
    console.log("Form submitted: ", formValues);
    // Here, implement the form submission logic.
  };

  const resetForm = () => {
    setFormValues(defaultFormData as ApplicantFormValues); // Reset form values
    setCurrentStep(0); // Reset to the first step
    // Reinitialize processed form configuration based on default data and step
    setProcessedFormConfig(
      FormUtils.preprocessForm(
        myJson as FormConfig,
        defaultFormData as ApplicantFormValues
      )
    );
  };

  return (
    <FormContext.Provider
      value={{
        formValues,
        setFormValue,
        currentStep,
        setCurrentStep,
        goToNextStep,
        goToPrevStep,
        submitForm,
        resetForm,
        processedFormConfig,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
