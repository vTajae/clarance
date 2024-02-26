import { LoaderFunction, json, redirect } from "@remix-run/cloudflare";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useDispatch, useTypedSelector } from "../state/hooks/user";
import { User } from "../../api/models/user";
import Navigation from "~/components/base/navigation";
import Header from "~/components/base/header";
import { useEffect } from "react";
import { RootState } from "~/state/store";
import Footer from "~/components/base/footer";
import PageTemplate from "~/components/base/pageTemplate";
import { checkAuthentication } from "~/utils/checkAuthentication";

type LoaderData = {
  user: User | null;
};

export default function dashboard() {
  const data = useLoaderData<LoaderData>();

  return (
      <div className="min-h-screen bg-gray-100 p-10">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Landing Page</h1>
  {data.user?.username}
      </div>
  );
}
