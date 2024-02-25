// import React, { useEffect, useState } from "react";
// import { useActionData, useNavigate } from "@remix-run/react";
// import {
//   json,
//   redirect,
//   ActionFunction,
//   LoaderFunction,
//   Session,
// } from "@remix-run/cloudflare";

// // import { UserCloudService } from "../../api/services/CloudFlare/user_service";
// // import { Credentials } from "~/props/credentials";
// // import { LoginCookieData } from "api/schemas/user/cookie";

// import { isAuthenticated } from "~/utils/session/sessionUtils";
// import { EnvWithKV, RequestContext } from "api/schemas/kv";
// import UserService from "api_v2/services/userService";
// import { userLogin } from "api_v2/types/userLogin";
// import { createSessionStorage } from "~/utils/session/session";

// interface ActionData {
//   error?: string;
// }

// // Define a type that matches the expected structure of your nested context
// interface NestedContext {
//   context: {
//     env: EnvWithKV;
//     // Include other properties of the nested context as needed
//   };
// }

// export const loader: LoaderFunction = async ({ request, context }) => {
//   // Assuming isAuthenticated is a function you've defined that checks if the user is authenticated

//   // Directly accessing the `env` from the context object

//   const nestedContext = context as unknown as NestedContext;

//   // Now you can access your env with the correct type
//   const env = nestedContext.context.env;

//   // Example usage of the env within isAuthenticated function
//   if (await isAuthenticated({ request, env })) {
//     // User is already logged in, redirect them to the dashboard or home page
//     return redirect("/home");
//   }

//   return json({});
// };



// export const action: ActionFunction = async ({ request, context }) => {
//   const nestedContext = context as unknown as NestedContext;

//   // Now you can access your env with the correct type
//   const env = nestedContext.context.env;
//   const userService = new UserService(env);
//   // const env = context.env as EnvWithKV; // Assuming context provides access to your environment variables
//   const { getSession, commitSession } = createSessionStorage(env);

//   const formData = await request.formData();
//   const actionType = formData.get("actionType");
//   // const userService = new UserService(env);

//   if (actionType === "login") {
//     const userData = {
//       username: formData.get("username"),
//       password: formData.get("password"),
//       role: formData.get("role"),
//     } as userLogin;

//     const loginResult = await userService.loginUser(userData);
    
//     if (loginResult.success) {
 
//       console.log("loginResult", loginResult);
//       // Create a new session and set login data
//       const session = await getSession(request.headers.get("Cookie"));
//       session.set("auth", { ...loginResult.user });

//       // Respond with a redirect and set the session cookie
//       return new Response(null, {
//         status: 303, // or 302, depending on your use case
//         headers: {
//           "Location": "/home",
//           "Set-Cookie": await commitSession(session),
//         },
//       });
//     } else {
//       // Handle login failure (e.g., return an error message)
//       const session = await getSession(request.headers.get("Cookie"));
//       session.flash("error", "Invalid username or password.");
//       return new Response(null, {
//         status: 303,
//         headers: {
//           "Location": "/login",
//           "Set-Cookie": await commitSession(session),
//         },
//       });
//     }
//   } else if (actionType === "register") {
//     // Handle registration similarly, potentially creating a session on successful registration
//   }

//   // Fallback for invalid action type
//   return json({ error: "Invalid action type." });
// };


// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState(""); // Add role state if needed for registration
//   const [actionType, setActionType] = useState("login"); // Toggle between login and register
//   const actionData = useActionData<ActionData>();

//   return (
//     <form
//       action="/login"
//       method="post"
//       className="max-w-lg mx-auto mt-2 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl"
//     >
//       {/* Toggle Form Action */}
//       <input type="hidden" name="actionType" value={actionType} />

//       <div className="mb-6">
//         <label
//           htmlFor="username"
//           className="block text-gray-300 text-base font-semibold mb-2"
//         >
//           Username
//         </label>
//         <input
//           type="text"
//           name="username"
//           id="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
//           placeholder="Enter your username"
//         />
//       </div>

//       <div className="mb-6">
//         <label
//           htmlFor="password"
//           className="block text-gray-300 text-base font-semibold mb-2"
//         >
//           Password
//         </label>
//         <input
//           type="password"
//           name="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 mb-3 leading-tight focus:outline-none focus:border-blue-500"
//           placeholder="Enter your password"
//         />
//       </div>

//       {actionType === "register" && (
//         // Add additional fields for registration as needed
//         <div className="mb-6">
//           <label
//             htmlFor="role"
//             className="block text-gray-300 text-base font-semibold mb-2"
//           >
//             Role
//           </label>
//           <select
//             name="role"
//             id="role"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="shadow border-2 border-gray-700 rounded-lg w-full py-3 px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:border-blue-500"
//           >
//             <option value="">Select a role</option>
//             <option value="2">User</option>
//             <option value="1">Admin</option>
//           </select>
//         </div>
//       )}

//       {actionData?.error && (
//         <div className="text-red-500 text-xs italic">{actionData.error}</div>
//       )}

//       <div className="flex items-center justify-between space-x-4">
//         <button
//           className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//           type="submit"
//           onClick={() => setActionType("login")}
//         >
//           Login
//         </button>
//         <button
//           className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//           type="submit"
//           onClick={() => setActionType("register")}
//         >
//           Register
//         </button>
//       </div>
//     </form>
//   );
// };

// export default Register;
