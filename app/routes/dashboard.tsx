import { LoaderFunction, json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useDispatch, useTypedSelector } from "../state/hooks/user";
import { User } from "../../api/models/user";
import Navigation from "~/components/navigation";
import Header from "~/components/header";
import { useEffect } from "react";
import { selectIsLoggedIn, setLogout, setUser } from "~/state/user/userSlice";
import { RootState } from "~/state/store";
import authenticateAndFetchProfile from "~/utils/auth/authenticateAndFetchProfile";


type LoaderData = {
    user: User | null;
  };
  
// app/root.tsx

// export const loader: LoaderFunction = async ({ request, context }) => {
//   try {
//     const user = await authenticateAndFetchProfile(request, context.env);
//     return json({ user });
//   } catch (error) {
//     // Handle errors such as failed authentication
//     console.error("Error in loader:", error);
//     return json({ user: null });
//   }
// };

export default function dashboard() {
const data = useLoaderData<LoaderData>();
const user = useTypedSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();

  // console.log(data, "data");
  // console.log(user, "user");

  // useEffect(() => {
  //   // Assuming `data.user` is the user data from the loader
  //   // and `user` is the user data from the Redux store
  
  //   // Check if user data from the loader is different from the Redux store
  //   const shouldUpdateUser = data.user
  //     ? !user.user || data.user.id !== user.user.id
  //     : !user.user;
  
  //   // Update the Redux store only if there's a change
  //   if (shouldUpdateUser) {
  //     if (data.user) {
  //       dispatch(setUser(data.user));
  //     } else {
  //       dispatch(setLogout());
  //     }
  //   }
  //   // Remove `user` from the dependency array to avoid re-triggering
  //   // on every user state change
  // }, [data.user, dispatch]);
  

  return (
    <div>
      <Header>
        <Navigation />
      </Header>
    </div>
  );
}
