// import { EnvWithKV } from "../../../api/schemas/kv";
// import { createSessionStorage } from "./session";

// interface RequestContext {
//     request: Request;
//     env: EnvWithKV;
//     // Include other properties from the context model as needed
//   }

// export async function isAuthenticated(
//  { request, env }: RequestContext
// ): Promise<boolean> {

//   const session = await createSessionStorage(env).getSession(request.headers.get("Cookie"));
//   // Check if the session has the required auth data
//   return session.has("auth");
// }


import { EnvWithKV } from "api/schemas/kv";
import { createSessionStorage } from "./session";

export async function isAuthenticated(
  request: Request,
  context: EnvWithKV
): Promise<boolean> {

  const session = await createSessionStorage(context).getSession(request.headers.get("Cookie"));
  // Check if the session has the required auth data
  return session.has("auth");
}

