import { RequestContext } from "api/schemas/context";
import { EnvWithKV } from "../../../api/schemas/kv";
import { createSessionStorage } from "./session";

// export async function isAuthenticated(
//  { request, context }: RequestContext
// ): Promise<boolean> {

//   const session = await createSessionStorage(context.env).getSession(request.headers.get("Cookie"));
//   // Check if the session has the required auth data
//   return session.has("auth");
// }
