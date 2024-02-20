import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { EnvWithKV } from "api/schemas/kv";
import { createSessionStorage } from "~/utils/session/session";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}


export async function onRequest(context: any, env: EnvWithKV) {
  

  const { getSession, commitSession, destroySession } = createSessionStorage(context);
  
  
  let session = await getSession(
    context.request.headers.get("Cookie")
  );


  let handleRequest = createPagesFunctionHandler({
    build,
    mode: build.mode,
    getLoadContext(context) {
      return { env:context, session };
    },
  });

  let response = await handleRequest(context);

  response.headers.append(
    "Set-Cookie",
    await commitSession(session)
  );

  return response;
}
