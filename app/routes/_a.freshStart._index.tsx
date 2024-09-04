import { Form, json, useLoaderData } from "@remix-run/react";
import { FormEvent, Suspense, useState } from "react";
import { useEmployee } from "../state/contexts/new-context";
import DynamicForm3 from "../utils/formHandler";
import { useDispatch, useTypedSelector } from "~/state/hooks/user";
import { RootState } from "~/state/store";
import { closeModal, openModal } from "~/state/user/userSlice";
import BasicInfo from "~/components/employee/BasicInfo";
import DynamicService from "../../api/service/dynamicService";
import { RenderPrintPDF } from "~/components/Rendered/RenderPrintPDF";
import Utils from "~/utils/utils";
import FormInfo from "api/interfaces2.0/FormInfo";
import { ApplicantFormValues } from "api/interfaces2.0/formDefinition";

type LoaderData = {
  formInfo: FormInfo;
  isLoading: boolean;
};

// Assuming this is part of a Remix loader function
export async function loader() {
  // const userService = new UserService();
  try {
    // const result = await userService.loadUserFormData("applicantData");
    // if (!result.success) {
    //   console.log("No employee data found");
    //   return json({});
    // }

    // const employee = result.formData;
    return json({ isLoading: false });
  } catch (e) {
    console.error("Failed to load employee data:", e);
    return json({ isLoading: false });
  }
}

const EmployeeIDPage = () => {
  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const dispatch = useDispatch();
  const loaderData = useLoaderData<LoaderData>();

  const isModalOpen = useTypedSelector(
    (state: RootState) => state.user.value.context.isModalOpen
  );

  const { loadEmployee, isLoading, data, getChanges } = useEmployee();

  const handleStartClick = async () => {
    const newUserID = Utils.generateUUIDv2();
    const updatedData = {
      ...data,
      personalInfo: {
        applicantID: newUserID,
        ...data.personalInfo,
      },
    };

    try {
      const dynamicService = new DynamicService();
      await dynamicService.saveUserFormData(
        "applicantData",
        updatedData as ApplicantFormValues
      );

      console.log("Data saved to IndexedDB successfully");
      await loadEmployee();
      // console.log(updatedData, "Updated Data");
      setPersonalInfoVisible(true);
      dispatch(openModal());
    } catch (error) {
      console.error("Failed to save data to IndexedDB:", error);
    }
  };

  // const { employee, isLoading } = loaderData;

  if (isLoading)
    return <div className="animate-pulse flex space-x-4">Loading ...</div>;

  const handleChange = (newData: ApplicantFormValues) => {
    // console.log("Updated Data:", newData);
  };

  const handleUpdateClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const applicantID = data.personalInfo.applicantID;
    if (!applicantID) {
      alert("Applicant ID is required.");
      return;
    }

    const changes = await getChanges();

    if (Object.keys(changes).length > 0) {
      try {
        console.log(changes, "Changes being sent");
        const dynamicService = new DynamicService();
        const response = await dynamicService.updateUserData(
          "applicantData",
          changes
        );
        console.log(response.message);

        await loadEmployee();

        // window.location.reload();
      } catch (error) {
        console.error("Failed to apply changes:", error);
      }
    } else {
      console.log("No changes to submit.");
    }
  };

  const toggleEditMode = () => {
    dispatch(openModal()); // Set isModalOpen to true to show the form

    window.scrollTo(0, 0); // Scrolls to the top each time mode is toggled
  };

  return (
    <Suspense fallback={<div>Hi</div>}>
      {!data?.personalInfo?.applicantID ? (
        <div className="p-4  rounded-lg">
          <button
            onClick={handleStartClick} // Ensure handleStartClick is defined in your component or context
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Start
          </button>
        </div>
      ) : (
        <div className="p-4  rounded-lg">
          {!isModalOpen ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center">
                <BasicInfo user={data} />
              </div>
            </div>
          ) : (
            <Form
              method="post"
              onSubmit={handleUpdateClick}
              className="space-y-4"
            >
              <DynamicForm3
                data={data}
                FormInfo={loaderData.formInfo}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="py-2 px-4 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition duration-150"
              >
                Update Infomation
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(closeModal());
                  window.scrollTo(0, 0);
                }}
                className="ml-4 py-2 px-4 bg-gray-500 text-white font-medium rounded hover:bg-gray-600 transition duration-150"
              >
                Cancel
              </button>
            </Form>
          )}
        </div>
      )}
      {data?.personalInfo?.applicantID && !isModalOpen && (
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full p-6 ">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Applicant Panel
            </h2>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                Edit Form
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <RenderPrintPDF data={data} />
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default EmployeeIDPage;
