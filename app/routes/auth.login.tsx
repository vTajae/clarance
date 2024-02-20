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
// import { commitSession, getSession } from "~/utils/session/session";



// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const username = formData.get("username");
//   const password = formData.get("password");

//   if (typeof username === "string" && typeof password === "string") {
//     try {
//       await UserService.registerUser(username, password);

//       return redirect("/");
//     } catch (error) {
//       console.error("Login failed:", error);
//       return json({ error: "Login failed" }, { status: 500 });
//     }
//   } else {
//     return json({ error: "Invalid form data" }, { status: 400 });
//   }
// };

// const Login: React.FC = () => {
//   const [username, setUsername] = React.useState("");
//   const [password, setPassword] = React.useState("");

//   return (
//     <Form action="/?index" method="post">
   
//       <label>Email</label>
//       <input
//         type="text"
//         name="username"
//         value={username}
//         placeholder="4321"
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <br />

//       <label>Password</label>
//       <input
//         type="password"
//         name="password"
//         value={password}
//         placeholder="1234"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br />

//       <button type="submit">Login</button>
//       {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
//     </Form>
//   );
// };

// export default Login;
