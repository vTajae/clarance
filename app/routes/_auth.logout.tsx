// File: routes/logout.tsx
import { ActionFunction, redirect } from "@remix-run/cloudflare";
import { RequestContext } from "~/utils/auth/UsercheckAuthentication";

export const action: ActionFunction = async ({
  request,context: {session}
}: RequestContext): Promise<Response>  => {

  // If you want to preserve QuickBooks and Plaid info, retrieve them from the session first
  const quickbooksAuth = session.get("quickbooksAuth");
  const plaidAuth = session.get("plaidAuth");

  // Clear the session or reset specific parts of it
  // If you want to completely clear the session, use session.unset for each key or session.clear()
  session.unset("auth");

  // If preserving QuickBooks and Plaid info, set them back into the session
  if (quickbooksAuth) {
    session.set("quickbooksAuth", quickbooksAuth);
  }
  if (plaidAuth) {
    session.set("plaidAuth", plaidAuth);
  }


  // Redirect to the home page or login page after updating the session
  return redirect("/");
};