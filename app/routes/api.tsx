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
import PageTemplate from "~/components/base/pageTemplate";
import { UserCloudService } from "api/services/CloudFlare/user_service";
import { EnvWithKV } from "../../api/schemas/user/kv";
import { checkAuthentication } from "~/utils/checkAuthentication";
import UserStatus from "~/components/base/userStatus";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const user = useTypedSelector((state: RootState) => state.user.value);

  return (
    <PageTemplate user={user}>
      {user.user && <UserStatus user={user} />}

      {/* Rest of the home page content */}
      <Outlet />
    </PageTemplate>
  );
}
