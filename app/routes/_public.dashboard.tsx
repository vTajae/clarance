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
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Plaid</h2>
            <p className="text-gray-600 mb-6">
              
              Connect your bank accounts securely with Plaid.
            </p>
            <a
              href="/plaid"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Connect to Plaid
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              QuickBooks
            </h2>
            <p className="text-gray-600 mb-6">
              Manage your accounting with QuickBooks.
            </p>
            <a
              href="/quickbooks"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Connect to QuickBooks
            </a>
          </div>

          {/* Add more cards for other services here */}
        </div>
      </div>
  );
}
