import React, { useState } from "react";
import { useActionData } from "@remix-run/react";
import { json, redirect, ActionFunction } from "@remix-run/cloudflare";
import { AuthCookie } from "~/utils/auth/auth";
import { UserService } from "../../api/services/user_service";
import { LoginResponse } from "api/models/user";

interface ActionData {
  error?: string;
}

async function loginUser(username: string, password: string) {
  try {
    return await UserService.loginUser(username, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Login failed");
  }
}

async function serializeCookie(user: LoginResponse, env: any) {
  const { access_token, refresh_token } = user.tokens;
  const cookieValue = JSON.stringify({
    username: user.user.username,
    userId: user.user.id,
    accessToken: access_token,
    refreshToken: refresh_token,
  });

  const authCookie = AuthCookie(env);
  return await authCookie.serialize(cookieValue);
}

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username === "string" && typeof password === "string") {
    try {
      const user = await loginUser(username, password);
      const serializedCookie = await serializeCookie(user, context.env);
      // console.log(user , "Login User")
      return new Response(null, {
        status: 303,
        headers: {
          "Set-Cookie": serializedCookie,
          "Location": "/dashboard",
        }
      });
    } catch (error) {
      // Return a more informative error message to the client
      return json(
        { error: "Login failed: Invalid credentials" },
        { status: 401 }
      );
    }
  } else {
    // Handle missing username or password
    return json({ error: "Missing username or password" }, { status: 400 });
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const actionData = useActionData<ActionData>();
  return (
    <form
      action="/login"
      method="post"
      className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl"
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

      <div className="flex items-center justify-between">
        <button
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
