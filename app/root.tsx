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

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: stylesheet }] : []),
];

type LoaderData = {
  user: User | null;
};

const store = initializeStore({});

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);

  // Exclude login and registration pages from authentication check
  if (url.pathname === "/login" || url.pathname === "/register") {
    return json({});
  }

  console.log(context, "ROOT LOADER CONTEXT");
  const user = await checkAuthentication({ request, context });

  try {
    console.log(user, "user");

    if (!user) {
      return redirect("/login");
    }
    return json({ user });
  } catch (error) {
    if (url.pathname !== "/login") {
      return redirect("/login");
    }
    return json({ error: "User is not authenticated" });
  }
};

export default function App() {
  const data = useLoaderData<LoaderData>();

  useEffect(() => {
    // Handle user state update after component is mounted
    if (data.user) {
      store.dispatch(setUser(data.user));
    } else {
      store.dispatch(setLogout());
    }
  }, [data.user]);

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
