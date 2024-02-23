import React, { useEffect, useState } from "react";
import { useActionData, useNavigate } from "@remix-run/react";
import {
  json,
  redirect,
  ActionFunction,
  LoaderFunction,
  Session,
} from "@remix-run/cloudflare";
import { UserService } from "../../api/services/user_service";
import { LoginResponse } from "api/models/user";
import Header from "~/components/base/header";
import Navigation from "~/components/base/navigation";
// import { UserCloudService } from "../../api/services/CloudFlare/user_service";
// import { Credentials } from "~/props/credentials";
// import { LoginCookieData } from "api/schemas/user/cookie";
import { useDispatch, useTypedSelector } from "~/state/hooks/user";
import { user } from "~/components/base/user";
import { RootState } from "~/state/store";
import PageTemplate from "~/components/base/pageTemplate";
import { isAuthenticated } from "~/utils/session/sessionUtils";
import { EnvWithKV } from "api/schemas/kv";

interface ActionData {
  error?: string;
}

export const loader: LoaderFunction = async ({ request, context }) => {
  if (await isAuthenticated({request, env: context.env as EnvWithKV})) {
    // User is already logged in, redirect them to the dashboard or home page
    return redirect("/home");
  }
  return json({});
};

// export const action: ActionFunction = async ({ request, context: {session} }) => {
//   // Assuming createSessionStorage is imported and env is available
//  let mySession = session as Session
//   try {
//     const formData = await request.formData();
//     const username = formData.get("username");
//     const password = formData.get("password");

//     if (typeof username === "string" && typeof password === "string") {
//       const user = await UserService.loginUser(username, password);

//       console.log(user, "user");
//       if (user) {
//         const tokenCreationTime = new Date().getTime(); // Get current timestamp

//         // Set session data
//         mySession.set("auth", {
//           username: user.user.username,
//           id: user.user.id,
//           accessToken: user.tokens.access_token,
//           refreshToken: user.tokens.refresh_token,
//           tokenCreationTime: tokenCreationTime,
//         });

//         return redirect("/home", {
//           // headers: {
//           //   "Set-Cookie": await commitSession(session),
//           // },
//         });
//       } else {
//         return json(
//           { error: "Invalid credentials" },
//           {
//             status: 401,
//           }
//         );
//       }
//     } else {
//       return json({ error: "Invalid input" }, { status: 400 });
//     }
//   } catch (error) {
//     return json({error: "Error processing request"}, { status: 500 });
//   }
// };

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const actionData = useActionData<ActionData>();

  return (
      <form
        action="/login"
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

        {actionData?.error && (
          <div className="text-red-500 text-xs italic">{actionData.error}</div>
        )}

        <div className="flex items-center justify-between space-x-4">
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            type="submit"
          >
            Login
          </button>
          {/* <button
            onClick={handleRegisterClick}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            type="button"
          >
            Register
          </button> */}
        </div>
      </form>
  );
};

export default Login;
