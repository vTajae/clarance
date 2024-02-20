import {
  json,
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { User } from "api/models/user";
import { useEffect } from "react";
import { useDispatch, useTypedSelector } from "~/state/hooks/user";
import { RootState } from "~/state/store";
import { setLogout, setUser } from "~/state/user/userSlice";
import Navigation from "~/components/navigation";
import Header from "~/components/header";
import { checkAuthentication } from "~/utils/checkAuthentication";


type LoaderData = {
  user: User | null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// export const loader: LoaderFunction = async ({ request, context }) => {
//   try {
//     const user = await checkAuthentication({request, context});
//     console.log(user, "user3");
    
//     return json({ user });
//   } catch (error) {
//     // Handle errors such as failed authentication
//     console.error("Error in loader:", error);
//     return redirect("/login");
//   }
// };




export default function Index() {
  // const data = useLoaderData<LoaderData>();
  const user = useTypedSelector((state: RootState) => state.user.value);
  const dispatch = useDispatch();
  
  // console.log(data, "data2");
  

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
    <>
    <Header>
      <Navigation />
    </Header>
    </>
  );
}
