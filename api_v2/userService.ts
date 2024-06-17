// import { ApplicantFormValues } from '~/components/form86/lastTry/formDefinition';

// interface UserServiceResponse {
//   success: boolean;
//   formData?: ApplicantFormValues;
//   message: string;
// }

// class UserService {

// // IndexedDB utility functions remain the same

// // User Service Methods
// async  saveUserFormData(section: string, formData: ApplicantFormValues): Promise<UserServiceResponse> {
//   try {
//     await saveFormData(section, formData); // Ensure saveFormData can handle Partial<ApplicantFormValues>
//     console.log("Form data saved successfully for section", section);
//     return { success: true, message: "Form data saved successfully." };
//   } catch (error) {
//     console.error("Error saving form data:", error);
//     return { success: false, message: "Failed to save form data due to a client-side error." };
//   }
// }

// async  loadUserFormData(section: string): Promise<UserServiceResponse> {
//   try {
//     const formData: ApplicantFormValues | null = await getFormData(section);
//     console.log(formData, "FormData");
//     if (formData) {
//       console.log("Form data retrieved successfully for section", section);
//       return { success: true, formData, message: "Form data retrieved successfully." };
//     } else {
//       console.log("No data found for section", section);
//       return { success: false, message: "No form data found." };
//     }
//   } catch (error) {
//     console.error("Error retrieving form data:", error);
//     return { success: false, message: "Failed to retrieve form data from database." };
//   }
// }

//   async deleteUserFormData(section: string): Promise<UserServiceResponse> {
//     try {
//       await deleteFormData(section);
//       console.log("Form data deleted successfully for section", section);
//       return { success: true, message: "Form data deleted successfully." };
//     } catch (error) {
//       console.error("Error deleting form data:", error);
//       return { success: false, message: "Failed to delete form data." };
//     }
//   }
// }

// export default UserService;
