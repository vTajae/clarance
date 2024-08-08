import type { ActionFunction, MetaFunction } from "@remix-run/cloudflare";
import { json, Outlet, redirect } from "@remix-run/react";
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
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const applicantData = formData.get("data");

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

    
    // await pdfService.pages(formValues);

    const response = await pdfService.reverseloadAndFillPdf(formValues);
    return json(response);
  } catch (error) {
    return json(
      {
        success: false,
        message: `Failed to generate PDF: ${error.message}`,
      },
      { status: 500 }
    );
  }
};





export default function Index() {
  return (
      <Outlet />
  );
}
