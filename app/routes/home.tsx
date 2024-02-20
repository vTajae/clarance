// import { LoaderFunction, json, redirect } from "@remix-run/node";
// import { UserService } from "services/user_service";
// import { useLoaderData, useNavigate } from "@remix-run/react";
// import { useDispatch, useTypedSelector } from "~/hooks/user";
// import { User } from "models/user";
// import Navigation from "~/components/navigation";
// import Header from "~/components/header";
// import { useEffect } from "react";
// import { selectIsLoggedIn, setUser } from "~/state/user/userSlice";
// import { RootState } from "~/state/store";
// import { authCookie } from "~/utils/auth/auth";

// export const loader: LoaderFunction = async ({ request }) => {
//   let cookieString = request.headers.get("Cookie");
//   let cookieData = await authCookie.parse(cookieString);

//   // console.log(cookieData, "Parsed Cookie Data");

//   // Parse the cookieData string into a JavaScript object
//   let parsedCookieData;
//   try {
//     parsedCookieData = JSON.parse(cookieData);
//   } catch (e) {
//     console.error("Error parsing cookie data:", e);
//     // Handle error, for example, by redirecting to login
//     return json({});
//   }

//   // Check if parsedCookieData has necessary tokens
//   if (
//     parsedCookieData &&
//     parsedCookieData.accessToken &&
//     parsedCookieData.refreshToken
//   ) {
//     // Set default headers with the tokens from parsed cookie data
//     UserService.setDefaultHeaders(
//       `my_token=${parsedCookieData.accessToken};myRefresh_token=${parsedCookieData.refreshToken}`
//     );

//     try {
//       const user = await UserService.getUserProfile();
//       if (user) {
//         // console.log(user, "I am user");
//         return json({ user });
//       } else {
//         await UserService.MyRefresh();
//         const user = await UserService.getUserProfile();
//         if (user) {
//           // console.log(user, "I am user");
//           return json({ user });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       // Handle token refresh or other error scenarios
//     }
//   } else {
//     // Redirect or handle unauthenticated state
//     return redirect("/");
//   }

//   // Continue with any additional logic as needed
//   return json({}); // Default response
// };

// export default function home() {
//   const data = useLoaderData<{ user: User | null }>(); // Assuming the loader might return null for 'user'
//   const user = useTypedSelector((state: RootState) => state.user.value);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (data.user) {
//       // Only dispatch if data.user is not null
//       if (!user.user || data.user.id !== user.user?.id) {
//         dispatch(setUser(data.user));
//       }
//     } else {
//       // Handle the scenario where data.user is null
//       // For example, redirect to login or show a message
//       console.log("No user data available");
//     }
//   }, [data.user, user, dispatch]);

//   if (!data.user) {
//     // Render alternative content or redirect if no user data
//     return <div>No user data available.</div>;
//   }

//   // Regular component content
//   return (
//     <div>
//       <Header>
//         <Navigation />
//       </Header>
//     </div>
//   );
// }

