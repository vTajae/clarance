import {
    json,
    redirect,
    type LoaderFunction,
    type MetaFunction,
  } from "@remix-run/cloudflare";
  import { Outlet, useLoaderData } from "@remix-run/react";
  import { User } from "api/models/user";
  import { useDispatch, useTypedSelector } from "~/state/hooks/user";
  import { RootState } from "~/state/store";
  import PageTemplate from "~/components/base/pageTemplate";
  import UserStatus from "~/components/base/userStatus";
  import { useEffect, useState } from "react";
  import { setLogout, setUser } from "~/state/user/userSlice";
  import { checkAuthentication } from "~/utils/checkAuthentication";
  import { RequestContext } from "api/schemas/kv";
  
  export interface UserToken {
    access_token: string | null;
  }
  
  type LoaderData = {
    user: User | null;
  };
  
  export const meta: MetaFunction = () => {
    return [
      { title: "New Remix App" },
      { name: "description", content: "Welcome to Remix!" },
    ];
  };
  
  export const loader: LoaderFunction = async ({
    request,
    context: { context },
  }) => {
    const url = new URL(request.url);
  
    const user = await checkAuthentication(context as RequestContext);
  
    try {
      console.log(user, "user");
  
      if (!user) {
        return redirect("/login");
      }
      return json({ user });
    } catch (error) {
      if (url.pathname !== "/login" || "/register") {
        return redirect("/login");
      }
      return json({ error: "User is not authenticated" });
    }
  };
  
  
  export default function Clearance() {
    const { user } = useLoaderData<LoaderData>();
    const ReduxUser = useTypedSelector((state: RootState) => state.user.value);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setLogout());
      }
    }, [user, dispatch]);
  
    // Optionally, to ensure the loading state is visible for a minimum amount of time, 
    // you could use a timeout here to delay setting `isHydrating` to false.
  
    return (
      <PageTemplate user={ReduxUser.user} context={ReduxUser.context}>
        {ReduxUser.context.isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {ReduxUser.user && <UserStatus user={ReduxUser.user} context={ReduxUser.context} />}
            <Outlet />
          </>
        )}
      </PageTemplate>
    );
  }