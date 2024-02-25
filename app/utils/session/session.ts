// Assuming EnvWithKV is an interface that includes your KV bindings and any other environment variables.
import { createWorkersKVSessionStorage, createCookie } from "@remix-run/cloudflare";
import { LoginCookieData } from "api/schemas/cookie";

export interface pages {
  home: string;
  welcome: string;
}

type SessionData = {
  // Define the structure of your session data
  pages?: string[];
  auth?: LoginCookieData;
};

type SessionFlashData = {
  error: string;
};

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


// Function to get the session secret, with default fallback
function getSessionSecret(env: EnvWithKV) {
  // Access the environment variable directly

  // console.log(env, "eeeefwergreg");

  let sessionSecret = env.USER_SESSION_SECRET || "default-secret";
  // if (!sessionSecret || sessionSecret === "default-secret") {
  //   console.warn("Session secret is not set or is set to the default. This is insecure in production.");
  // }
  return sessionSecret;
}


// You don't need to manually fetch the session secret from the environment variables;
// Cloudflare automatically makes them available via the `env` parameter in your functions.
// This function now simply ensures types are respected.

export function createSessionStorage(env: EnvWithKV) {

  // Create a cookie to store session data
  const sessionCookie = createCookie("__session", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [getSessionSecret(env)], // Use the session secret from the environment variable or a default value
    secure: true,
  });

  const { getSession, commitSession, destroySession } = createWorkersKVSessionStorage<SessionData, SessionFlashData>({
    kv: env.theform, // Using the KV namespace from the environment
    cookie: sessionCookie,
  });

  return { getSession, commitSession, destroySession };
}
