import type { ActionFunction, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/react";
import PdfService from "api/service/pdfService";
import { RenderPrintPDF } from "~/components/Rendered/RenderPrintPDF";
import { useEmployee } from "~/state/contexts/new-context";





export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export default function Index() {
  const { data } = useEmployee();

  return (
    <>
      <RenderPrintPDF data={data} />
    </>
  );
}
