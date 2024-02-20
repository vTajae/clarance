// File: routes/logout.tsx
import { ActionFunction, redirect } from "@remix-run/cloudflare";
import { AuthCookie } from "~/utils/auth/auth";

export const action: ActionFunction = async ({ request, context }) => {
    const env = context.env;
  const authCookie = AuthCookie(env);

  // Serialize the cookie with a past expiration date to clear it
  const expiredCookie = await authCookie.serialize("", { maxAge: -1 });

  // Redirect to the home page or login page after clearing the cookie
  return redirect("/", {
    headers: {
      "Set-Cookie": expiredCookie,
    },
  });
};
