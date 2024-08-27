import type { ActionFunction, MetaFunction } from "@remix-run/cloudflare";
import { json, Outlet, redirect } from "@remix-run/react";
import DynamicService from "api_v2/service/dynamicService";
import PdfService from "api_v2/service/pdfService";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = async () => {
  
  return redirect("/freshStart");
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const applicantData = formData.get("data");
  const actionType = formData.get("actionType");

  if (applicantData === null) {
    return json(
      {
        success: false,
        message: "No applicant data provided",
      },
      { status: 400 }
    );
  }

  let formValues;

  try {
    formValues = JSON.parse(applicantData as string);
  } catch (error) {
    return json(
      {
        success: false,
        message: `Failed to parse applicant data: ${error.message}`,
      },
      { status: 400 }
    );
  }


  const pdfService = new PdfService();

  try {
    if (actionType === "generatePDF") {
      const response = await pdfService.loadAndFillPdf(formValues);
      return json({
        success: true,
        message: "PDF generated successfully.",
        response,
      });
    } else if (actionType === "generateJSON") {
      const response = await pdfService.reverseloadAndFillPdf(formValues);
      return json({
        success: true,
        message: "JSON generated successfully.",
        response,
      });
    } else {
      return json(
        {
          success: false,
          message: "Invalid action type.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return json(
      {
        success: false,
        message: `Failed to process request: ${error.message}`,
      },
      { status: 500 }
    );
  }
};

export default function Index() {
  return <Outlet />;
}
