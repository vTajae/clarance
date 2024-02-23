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

export interface UserToken {
  access_token: string | null;
}

type LoaderData = {
  user: User | null;
  tokens: UserToken | null;
};



export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export default function Auth() {
  const {user} = useLoaderData<LoaderData>();
  const data = useLoaderData<LoaderData>();
  const ReduxUser = useTypedSelector((state: RootState) => state.user.value);

  return (
    <PageTemplate user={ReduxUser.user} context={ReduxUser.context}>
      {/* Rest of the home page content */}
      {ReduxUser.user && <UserStatus user={ReduxUser.user} context={ReduxUser.context} />}

      <Outlet />
    </PageTemplate>
  );
}
