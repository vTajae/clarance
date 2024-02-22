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

// Assuming you have a way to determine the user's intended destination or a default route
const DEFAULT_AUTHENTICATED_ROUTE = "/";

export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Checking if the user is authenticated
  const isAuthenticated = await checkAuthentication({ request, env });

  if (isAuthenticated) {
    // If the user is trying to access /login or /register, redirect them
    if (url.pathname === "/login" || url.pathname === "/register") {
      // Redirecting to the intended destination or default route for authenticated users
      return new Response(null, {
        status: 302,
        headers: {
          "Location": DEFAULT_AUTHENTICATED_ROUTE,
        },
      });
    }
    // Proceed to the requested page if it's not /login or /register
    return next(request);
  } else {
    // If the user is not authenticated and trying to access a protected route, redirect them to /login
    if (url.pathname !== "/login" && url.pathname !== "/register") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/login",
        },
      });
    }
    // Proceed to /login or /register if the user is not authenticated
    return next(request);
  }
}
