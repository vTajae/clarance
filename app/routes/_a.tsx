import type { MetaFunction } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { FormProvider } from "~/components/form86/samples/formContext";
import { EmployeeProvider2 as FormProvider2 } from "../state/contexts/new-context copy";

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
  return (
    <FormProvider2>
      <FormProvider>
        <Outlet />
      </FormProvider>
    </FormProvider2>
  );
}
