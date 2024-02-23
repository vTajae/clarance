import React, { useState } from "react";
import { useActionData } from "@remix-run/react";
import {
  json,
  redirect,
  ActionFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import { UserService } from "../../api/services/user_service";
import Header from "~/components/base/header";
import Navigation from "~/components/base/navigation";
import PageTemplate from "~/components/base/pageTemplate";
import { useTypedSelector } from "~/state/hooks/user";
import { isAuthenticated } from "~/utils/session/sessionUtils";
import { EnvWithKV } from "api/schemas/kv";

interface ActionData {
  error?: string;
}

export const loader: LoaderFunction = async ({ request, context }) => {
  if (await isAuthenticated({request, env: (context.env as EnvWithKV)})) {
    // User is already logged in, redirect them to the dashboard or home page
    return redirect("/home");
  }

  return json({})

};

async function registerUser(username: string, password: string) {
  try {
    return await UserService.registerUser(username, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed");
  }
}

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username === "string" && typeof password === "string") {
    try {
      await registerUser(username, password);
      // console.log(user , "Login User")
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/login",
        },
      });
    } catch (error) {
      // Return a more informative error message to the client
      return json({ error: "Registration failed." }, { status: 501 });
    }
  } else {
    // Handle missing username or password
    return json({ error: "Missing username or password" }, { status: 400 });
  }
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const actionData = useActionData<ActionData>();
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const user = useTypedSelector((state) => state.user.value);
  const handleCheckboxChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setHasAgreedToTerms(event.target.checked);
  };

  return (
    <PageTemplate user={user}>
      <form
        action="/register"
        method="post"
        className="max-w-lg mx-auto mt-2 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl"
      >
        <div className="mb-6">
          <label
            className="block text-gray-300 text-base font-semibold mb-2"
            htmlFor="username"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
            id="username"
            type="text"
            name="username"
            value={username}
            placeholder="Enter your email"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-300 text-base font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 mb-3 leading-tight focus:outline-none focus:border-blue-500"
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="termsOfService"
            className="block text-gray-300 text-base font-semibold mb-2"
          >
            <input
              type="checkbox"
              id="termsOfService"
              checked={hasAgreedToTerms}
              onChange={handleCheckboxChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm text-white">
              I have read and agree to the <br/>
              <a
                href="/info/terms"
                target="_blank"
                className="text-blue-500 hover:text-blue-700"
                style={{ margin: "0 5px" }}
              >
                Terms of Service
              </a>
              and
              <a
                href="/info/privacy"
                target="_blank"
                className="text-blue-500 hover:text-blue-700"
                style={{ margin: "0 5px" }}
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {actionData?.error && (
          <div className="text-red-500 text-xs italic">{actionData.error}</div>
        )}
        <div className="flex items-center justify-between">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            type="submit"
            disabled={!hasAgreedToTerms} // Disable the button if Terms of Service not agreed
          >
            Register
          </button>
        </div>
      </form>
    </PageTemplate>
  );
};

export default Register;
