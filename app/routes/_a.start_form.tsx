import { useState } from "react";
import PageTemplate from "~/components/form86/Template";
import FormStates from "~/components/form86/FormStates";
import { Alias, PersonalInfo, CitizenshipInfo } from "../../api_v2/interfaces/form";

const StartForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const updateAlias = (alias: Alias) => {
    // Implementation to update alias info
    console.log(alias);
  };

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    // Implementation to update personal info
    console.log(info);
  };

  const updateCitizenshipInfo = (info: Partial<CitizenshipInfo>) => {
    // Implementation to update personal info
    console.log(info);
  };

  return (
    <>
      {currentStep === 0 ? (
        <button onClick={() => setCurrentStep(1)} className="btn btn-primary">
          Start
        </button>
      ) : (
        <PageTemplate
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalSteps={29} // Adjust based on the total number of steps in your form
        >
          <FormStates
            step={currentStep}
            updateAlias={updateAlias}
            updatePersonalInfo={updatePersonalInfo}
            updateCitizenshipInfo={updateCitizenshipInfo}
          />
        </PageTemplate>
      )}
    </>
  );
};

export default StartForm;
