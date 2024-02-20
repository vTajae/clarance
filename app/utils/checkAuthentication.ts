import { AppLoadContext } from "@remix-run/cloudflare";
import { EnvWithKV } from "../../api/schemas/kv";
import { createSessionStorage } from "../utils/session/session";
import { LoginCookieData } from "api/schemas/cookie";

export interface RequestContext {
  request: Request; // Use appropriate type here
  context: any; // Adjust based on what env contains
}

export async function checkAuthentication({
  context,
  request,
}: RequestContext): Promise<LoginCookieData | false> {
  let session = await createSessionStorage(context.env).getSession(
    request.headers.get("Cookie")
  );

  if (session.get("auth")) {
    try {
      // Your authentication logic here

      const parsedCookieData: LoginCookieData = session.get(
        "auth"
      ) as LoginCookieData;
      
      return parsedCookieData;
    } catch (error) {
      console.error("Error parsing cookie data:", error);
    }
  }
  return false;
}
