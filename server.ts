import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { EnvWithKV } from "api/schemas/kv";
import { createSessionStorage } from "~/utils/session/session";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export async function onRequest(context: any) {
  // console.log(context, "context in SERVER")

  const { getSession, commitSession } = createSessionStorage(context.env);

  let session = await getSession(context.request.headers.get("Cookie"));
  console.log(session.data, "SERVER SESSION");

  
  let handleRequest = createPagesFunctionHandler({
    build,
    mode: build.mode,
    getLoadContext(context) {
      return { ...context, session };
    },
  });

  let response = await handleRequest(context);

  response.headers.append("Set-Cookie", await commitSession(session));

  return response;
}
