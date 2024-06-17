import { Session } from "@remix-run/cloudflare";
import { LoginCookieData } from "api/schemas/cookie";
// import UserService from "api_v2/services/userService";

interface RequestContext {
  session: Session;
}

export async function checkAuthentication({
  session,
}: RequestContext): Promise<LoginCookieData | false> {
  if (session) {
    const authData = session.get("auth");

    // Check if session contains auth data
    if (!authData) {
      return false; // No auth session data
    }

    return authData;
  }

  return false;

  // Retrieve and parse the stored session data

  // Assume token needs to be refreshed if it's older than an hour
  // const needsRefresh = new Date().getTime() - authData.updatedAt > 3600000; // 1 hour

  // if (needsRefresh) {
  //   // Attempt to refresh the token
  //   const refreshedData = await userService.refreshUser();
  //   if (refreshedData.success) {
  //     // Update the session with the new token data
  //     session.set("auth", {
  //       ...authData,
  //       updatedAt: new Date().getTime(),
  //     });
  //     // Optionally, commit the session if you're modifying it
  //     // return { ...refreshedData, session };
  //   } else {
  //     // Token refresh failed, handle accordingly
  //     return false;
  //   }
  // }

  // Return the auth data (or refreshed data) if the token is still valid
}
