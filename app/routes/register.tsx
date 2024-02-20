// import {
//   ActionFunction,
//   ActionFunctionArgs,
//   LoaderFunction,
//   json,
//   redirect,
//   redirectDocument,
// } from "@remix-run/node";
// import {
//   Form,
//   useActionData,
//   useLoaderData,
//   useNavigate,
// } from "@remix-run/react";
// import { User } from "models/user";
// import React, { useEffect } from "react";
// import { UserService } from "services/user_service";
// import { useDispatch, useTypedSelector } from "~/hooks/user";
// import { Helpers } from "~/shared/helpers";
// import { RootState } from "~/state/store";
// import { setUser } from "~/state/user/userSlice";
// import { authCookie } from "~/utils/auth/auth";
// import { commitSession, getSession } from "~/utils/session/session";

// //   export const loader: LoaderFunction = async ({ request }) => {
// //     let cookieString = request.headers.get("Cookie");
// //     let cookieData = await authCookie.parse(cookieString);

// //     // console.log(cookieData, "Parsed Cookie Data");

// //     // Parse the cookieData string into a JavaScript object
// //     let parsedCookieData;
// //     try {
// //       parsedCookieData = JSON.parse(cookieData);
// //     } catch (e) {
// //       console.error("Error parsing cookie data:", e);
// //       // Handle error, for example, by redirecting to login
// //       return json({});
// //     }

// //     // Check if parsedCookieData has necessary tokens
// //     if (
// //       parsedCookieData &&
// //       parsedCookieData.accessToken &&
// //       parsedCookieData.refreshToken
// //     ) {
// //       // Set default headers with the tokens from parsed cookie data
// //       UserService.setDefaultHeaders(
// //         `my_token=${parsedCookieData.accessToken};myRefresh_token=${parsedCookieData.refreshToken}`
// //       );

// //       try {
// //         const user = await UserService.getUserProfile();
// //         if (user) {
// //           return redirect("/dashboard");
// //         } else {
// //           await UserService.MyRefresh();
// //           const user = await UserService.getUserProfile();
// //           if (user) {
// //             return redirect("/dashboard");
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Error fetching user profile:", error);
// //         // Handle token refresh or other error scenarios
// //       }
// //     } else {
// //       // Redirect or handle unauthenticated state
// //       return json({});
// //     }

// //     // Continue with any additional logic as needed
// //     return json({}); // Default response
// //   };

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const username = formData.get("username");
//   const password = formData.get("password");

//   if (typeof username === "string" && typeof password === "string") {
//     try {
//       const response = await UserService.registerUser(username, password);

//       return redirect("/");
//     } catch (error) {
//       console.error("Register failed:", error);
//       return json({ error: "Register failed" }, { status: 500 });
//     }
//   } else {
//     return json({ error: "Invalid form data" }, { status: 400 });
//   }
// };

// const Register: React.FC = () => {
//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");

//   return (
//     <form
//       action="/register"
//       method="post"
//       className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl"
//     >
//       <div className="mb-4">
//         <label
//           className="block text-gray-300 text-base font-semibold mb-2"
//           htmlFor="username"
//         >
//           Email
//         </label>
//         <input
//           className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
//           id="username"
//           type="text"
//           name="username"
//           value={username}
//           placeholder="Enter your email"
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>

//       <div className="mb-4">
//         <label
//           className="block text-gray-300 text-base font-semibold mb-2"
//           htmlFor="password"
//         >
//           Password
//         </label>
//         <input
//           className="shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500"
//           id="password"
//           type="password"
//           name="password"
//           value={password}
//           placeholder="Enter your password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//       >
//         Register
//       </button>
//       {/* {error && <div className="text-red-500 text-xs italic">{error}</div>} */}
//     </form>
//   );
// };

// export default Register;
