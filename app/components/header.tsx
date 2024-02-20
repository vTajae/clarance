import React from "react";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useDispatch, useTypedSelector } from "../state/hooks/user";
import { setLogout, selectIsLoading } from "~/state/user/userSlice";
import { useFetcher } from "@remix-run/react";
import { RootState } from "~/state/store";

function MyHeader({ children }: { children: React.ReactNode }) {
  const fetcher = useFetcher();
  const user = useTypedSelector((state: RootState) => state.user.value);
  const isLoggedIn = useTypedSelector((state) => state.user.value.isLoggedIn);
  const isLoading = useTypedSelector(selectIsLoading); // Access isLoading state
  const dispatch = useDispatch();

  // console.log("user", user);

  // console.log("isLoggedIn", isLoggedIn);

  const handleLogout = () => {
    // Dispatch the setLogout action to reset the Redux state
    dispatch(setLogout());
    // Use fetcher to submit the logout action
    fetcher.submit({}, { method: "post", action: "/logout" });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen bg-gray-200">
          <span className="text-xl font-medium text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          <nav className="bg-white shadow-md py-4 px-5">
            <ul className="flex space-x-4">
              {/* <li>
                <Link
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                  to="/home"
                  prefetch="intent"
                >
                  Home
                </Link>
              </li> */}
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      to="/login"
                      prefetch="intent"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      to="/register"
                      prefetch="intent"
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      to="/dashboard"
                      prefetch="intent"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      to="/api/plaid"
                      prefetch="intent"
                    >
                      plaid
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      to="/api/quickbooks"
                      prefetch="intent"
                    >
                      quickbooks
                    </Link>
                  </li>
                  <li>
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <main className="p-6">{children}</main>
        </>
      )}
    </>
  );
}

export default MyHeader;
