import DynamicRepository from "../repository/dynamicRepository";
import {
  ApplicantContactNumber,
  ApplicantFormValues,
} from "~/components/form86/lastTry/formDefinition";
import Utils from "~/utils/forms";
import pkg from "lodash";
import { ApplicantResidency } from "api_v2/interfaces/Residency";

interface UserServiceResponse {
  success: boolean;
  formData?: ApplicantFormValues;
  message: string;
}

class DynamicService {
  private dynamicRepo: DynamicRepository;
  private utils: Utils;

  constructor() {
    this.dynamicRepo = new DynamicRepository();
    this.utils = new Utils();
  }

  async saveUserFormData(
    section: string,
    formData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    try {
      await this.dynamicRepo.saveFormData(section, formData); // Ensure saveFormData can handle Partial<ApplicantFormValues>
      console.log("Form data saved successfully for section", section);
      return { success: true, message: "Form data saved successfully." };
    } catch (error) {
      console.error("Error saving form data:", error);
      return {
        success: false,
        message: "Failed to save form data due to a client-side error.",
      };
    }
  }

  async loadUserFormData(key: string): Promise<UserServiceResponse> {
    try {
      const formData: ApplicantFormValues | null =
        await this.dynamicRepo.getFormData(key);

      if (formData) {
        console.log("Form data retrieved successfully for section", key);
        return {
          success: true,
          formData,
          message: "Form data retrieved successfully.",
        };
      } else {
        console.log("No data found for section", key);
        return { success: false, message: "No form data found." };
      }
    } catch (error) {
      console.error("Error retrieving form data:", error);
      return {
        success: false,
        message: "Failed to retrieve form data from database.",
      };
    }
  }

  async deleteUserFormData(section: string): Promise<UserServiceResponse> {
    try {
      await this.dynamicRepo.deleteFormData(section);
      console.log("Form data deleted successfully for section", section);
      return { success: true, message: "Form data deleted successfully." };
    } catch (error) {
      console.error("Error deleting form data:", error);
      return { success: false, message: "Failed to delete form data." };
    }
  }

  async updateUserData(
    section: string,
    changes: any,
    // updatedData: ApplicantFormValues
  ): Promise<UserServiceResponse> {
    const { cloneDeep } = pkg;
    try {
      
      const currentData: ApplicantFormValues | null =
        await this.dynamicRepo.getFormData(section);
  
      if (!currentData) {
        return {
          success: false,
          message: "No existing data found for update.",
        };
      }
  
      // console.log("Changes in service:", changes);
      // console.log("Current data:", currentData);
  
      // Create a deep copy of the current data to avoid mutations
      const updatedData = cloneDeep(currentData);
  


      // Apply modifications
      if (changes.modified) {

        if (changes.modified.personalInfo) {
          console.log("Modifying personalInfo:", changes.modified.personalInfo);
          updatedData.personalInfo = {
            ...updatedData.personalInfo,
            ...changes.modified.personalInfo,
          };
        }

        if (changes.modified.namesInfo) {
          console.log("Modifying namesInfo:", changes.modified.namesInfo);
          updatedData.namesInfo = {
            ...updatedData.namesInfo,
            ...changes.modified.namesInfo,
          };
        }

        if (changes.modified.namesInfo) {
          console.log("Modifying namesInfo:", changes.modified.namesInfo);
          updatedData.namesInfo = {
            ...updatedData.namesInfo,
            ...changes.modified.namesInfo,
          };
        }
  
        if (changes.modified.aknowledgementInfo) {
          console.log("Modifying aknowledgementInfo:", changes.modified.aknowledgementInfo);
          updatedData.aknowledgementInfo = {
            ...updatedData.aknowledgementInfo,
            ...changes.modified.aknowledgementInfo,
          };
        }


        if (changes.modified.physicalAttributes) {
          console.log("Modifying physicalAttributes:", changes.modified.physicalAttributes);
          updatedData.physicalAttributes = {
            ...updatedData.physicalAttributes,
            ...changes.modified.physicalAttributes,
          };
        }

        if (changes.modified.dualCitizenshipInfo) {
          console.log("Modifying dualCitizenshipInfo:", changes.modified.dualCitizenshipInfo);
          updatedData.dualCitizenshipInfo = {
            ...updatedData.dualCitizenshipInfo,
            ...changes.modified.dualCitizenshipInfo,
          };
        }

        if (changes.modified.schoolInfo) {
          console.log("Modifying schoolInfo:", changes.modified.schoolInfo);
          updatedData.schoolInfo = {
            ...updatedData.schoolInfo,
            ...changes.modified.schoolInfo,
          };
        }
        
        
  
        if (changes.modified.citizenshipInfo) {
          console.log("Modifying citizenshipInfo:", changes.modified.citizenshipInfo);
          updatedData.citizenshipInfo = {
            ...updatedData.citizenshipInfo,
            ...changes.modified.citizenshipInfo,
          };
        }
  
        if (changes.modified.dualCitizenshipInfo) {
          console.log("Modifying dualCitizenshipInfo:", changes.modified.dualCitizenshipInfo);
          updatedData.dualCitizenshipInfo = {
            ...updatedData.dualCitizenshipInfo,
            ...changes.modified.dualCitizenshipInfo,
          };
        }
  
        if (changes.modified.contactInfo) {
          console.log("Modifying contactNumbers:", changes.modified.contactInfo.contactNumbers);
          changes.modified.contactInfo.contactNumbers.forEach((modifiedNumber: any) => {
            const index = updatedData.contactInfo.contactNumbers.findIndex(
              (num: ApplicantContactNumber) =>
                num._id === modifiedNumber._id
            );
  
            if (index !== -1) {
              console.log(`Updating contact number at index ${index}:`, modifiedNumber);
              updatedData.contactInfo.contactNumbers[index] = {
                ...updatedData.contactInfo.contactNumbers[index],
                ...modifiedNumber,
              };
            }
          });
        }


     

        console.log(changes.modified.residencyInfo, "RESIDENCY CHANGES")
  
        if (changes.modified.residencyInfo) {
          console.log("Modifying residencyInfo:", changes.modified.residencyInfo);
          changes.modified.residencyInfo.forEach((modifiedResidency: any) => {
            const index = updatedData.residencyInfo.findIndex(
              (residency: ApplicantResidency) =>
                residency._id === modifiedResidency._id
            );
  
            if (index !== -1) {
              console.log(`Updating residency info at index ${index}:`, modifiedResidency);
              updatedData.residencyInfo[index] = {
                ...updatedData.residencyInfo[index],
                ...modifiedResidency,
              };
            }
          });
        }
      }
  
      // Handle additions
      if (changes.added) {
        if (changes.added.contactNumbers) {
          console.log("Adding contactNumbers:", changes.added.contactNumbers);
          updatedData.contactInfo.contactNumbers.push(
            ...changes.added.contactNumbers
          );
        }
  
        if (changes.added.residencyInfo) {
          console.log("Adding residencyInfo:", changes.added.residencyInfo);
          updatedData.residencyInfo.push(...changes.added.residencyInfo);
        }

      }
  

      if (changes.deleted) {
        if (changes.deleted.contactNumbers) {
          console.log("Deleting contactNumbers:", changes.deleted.contactNumbers);
          changes.deleted.contactNumbers.forEach((deletedNumber: any) => {
            updatedData.contactInfo.contactNumbers = updatedData.contactInfo.contactNumbers.filter(
              (num: any) => num._id !== deletedNumber._id
            );
          });
        }
        if (changes.deleted.residencyInfo) {
          console.log("Deleting residencyInfo:", changes.deleted.residencyInfo);
          changes.deleted.residencyInfo.forEach((deletedResidency: any) => {
            updatedData.residencyInfo = updatedData.residencyInfo.filter(
              (residency: any) => residency._id !== deletedResidency._id
            );
          });
        }
      }



      // console.log("Updated data:", updatedData);
  
      // Save the updated data
      await this.dynamicRepo.saveFormData(section, updatedData);
      // console.log("Data updated successfully in IndexedDB");
  
      return {
        success: true,
        formData: updatedData,
        message: "Data updated successfully.",
      };
    } catch (error) {
      console.error("Failed to update data in IndexedDB:", error);
  
      return {
        success: false,
        message: "Failed to update form data due to a client-side error.",
      };
    }
  }

  
}

export default DynamicService;
