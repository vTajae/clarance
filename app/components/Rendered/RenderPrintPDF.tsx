import React from "react";
import PdfService from "../../../api_v2/service/pdfService"; // Adjust the path as necessary
import { ApplicantFormValues } from "../form86/lastTry/formDefinition";
import { ActionFunction, json } from "@remix-run/cloudflare";
import { Form, useActionData } from "@remix-run/react";
import { action } from "~/routes/_a.printPDF._index";
import { useEmployee } from "~/state/contexts/new-context copy";



interface FormProps {
  data: ApplicantFormValues;
}

interface ActionData {
    success: boolean;
    message: string;
}

const RenderPrintPDF: React.FC<FormProps> = () => {
    const actionData = useActionData<ActionData>();
    const { data } = useEmployee();

    // Convert data to JSON string for the hidden input field
    const dataJSON = JSON.stringify(data);

    return (
      <div>
        <h1>{actionData?.message}</h1>
        {actionData?.message && <p>{actionData.message}</p>}
        <Form method="post" action="/printPDF">
          {/* Include form fields for the PDF data here */}
          <input type="hidden" name="data" value={dataJSON} />
          <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-150 ease-in-out"
              >
           Generate PDF
              </button>
        </Form>
      </div>
    );
};

export { RenderPrintPDF };