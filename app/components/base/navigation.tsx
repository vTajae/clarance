import React from "react";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { useTypedSelector } from "../../state/hooks/user";
import { UserContext, UserModel, UserState, setLogout } from "~/state/user/userSlice";
import { useDispatch } from "~/state/hooks/user";

interface NavigationProps {
  context: UserContext
}


const Navigation: React.FC<NavigationProps> = ({  context }) => {
  const fetcher = useFetcher();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    // Dispatch the setLogout action to reset the Redux state
    fetcher.submit({}, { method: "post", action: "/logout" });
    dispatch(setLogout());
    // Use fetcher to submit the logout action
  };
  return (
    <>
      <nav className="bg-white shadow-md py-4 px-5">
        <ul className="flex space-x-4">
          {!context.isLoggedIn ? (
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
              {/* <li>
                <Link
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                  to="/dashboard"
                  prefetch="intent"
                >
                  Dashboard
                </Link>
              </li> */}
              <li>
                <Link
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                  to="/info"
                  prefetch="intent"
                >Info
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
    </>
  );
};

export default Navigation;


