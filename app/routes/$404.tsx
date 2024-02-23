// app/routes/$404.tsx

import { json, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";

// Optional: Loader function if you want to perform server-side operations
export const loader: LoaderFunction = async ({ request }) => {
  // You can perform logging or other server-side logic here
  const url = new URL(request.url);
  console.warn(`Page not found: ${url.pathname}`);
  return json({ pathname: url.pathname });
};

type LoaderData = {
    pathname: string; // Define the type of data returned by your loader
  };

// React component for the 404 page
const NotFoundPage = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">404: Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-6">The requested URL {data.pathname} was not found on this server.</p>
    <Link
      to="/"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
    >
      Go to Home
    </Link>
  </div>
  
  );
};

export default NotFoundPage;
