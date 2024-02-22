import { checkAuthentication } from "~/utils/checkAuthentication";

// Define the structure of the environment variables
interface EnvWithKV {
  USER_SESSION_SECRET: string;
  USER_COOKIE_SECRET: string;
  ASSETS: object;
  theform: KVNamespace;
  __STATIC_CONTENT: KVNamespace;
}

// Define the overall context model including the request and environment variables
interface RequestContext {
  request: Request;
  env: EnvWithKV;
  // Include other properties from the context model as needed
}

// In root.ts (Cloudflare Worker)
export async function onRequest(context: any) {
  const { request, env, next } = context;

  // console.log(env, "env in onRequest");
  // console.log(context, "context in onRequest");

  const url = new URL(request.url);

  const isAuthenticated = await checkAuthentication(context); // Use the same function as in root loader

  if (isAuthenticated) {
    // Exclude login and registration pages from authentication check
    if (url.pathname === "/login" || url.pathname === "/register") {
      return Response.redirect(new URL("/", request.url).toString());
    }
    return next(request);
  } else {
    return Response.redirect(new URL("/login", request.url).toString());
  }
}
