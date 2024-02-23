import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Provider } from "react-redux";
import { initializeStore } from "./state/store";
import stylesheet from "./index.css";
import { setLogout, setUser } from "./state/user/userSlice";
import { User } from "api/models/user";
import { json, redirect } from "@remix-run/cloudflare";
import { checkAuthentication } from "./utils/checkAuthentication";
import { useEffect } from "react";
import { EnvWithKV } from "api/schemas/kv";

interface RequestContext {
  request: Request;
  env: EnvWithKV;
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: stylesheet }] : []),
];

type LoaderData = {
  user: User | null;
};

const store = initializeStore({});

// export const loader: LoaderFunction = async ({
//   request,
//   context: { context },
// }) => {
//   const url = new URL(request.url);

//   const user = await checkAuthentication(context as RequestContext);

//   try {
//     console.log(user, "user");

//     if (!user) {
//       return redirect("/login");
//     }
//     return json({ user });
//   } catch (error) {
//     if (url.pathname !== "/login" || "/register") {
//       return redirect("/login");
//     }
//     return json({ error: "User is not authenticated" });
//   }
// };

export default function App() {
  // const { user } = useLoaderData<LoaderData>();
  // const dispatch = store.dispatch;

  // useEffect(() => {
  //   // Handle user state update after component is mounted
  //   if (user) {
  //     dispatch(setUser(user));
  //   } else {
  //     dispatch(setLogout());
  //   }
  // }, [user]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Provider>
      </body>
    </html>
  );
}
