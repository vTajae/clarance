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

// You don't need to manually fetch the session secret from the environment variables;
// Cloudflare automatically makes them available via the `env` parameter in your functions.
// This function now simply ensures types are respected.

export function createSessionStorage(context: any) {

  // Create a cookie to store session data
  const sessionCookie = createCookie("__session", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [context.env.USER_SESSION_SECRET], // Securely using the session secret from environment variables
    secure: true,
  });

  const { getSession, commitSession, destroySession } = createWorkersKVSessionStorage<SessionData, SessionFlashData>({
    kv: context.env.theform, // Using the KV namespace from the environment
    cookie: sessionCookie,
  });

  return { getSession, commitSession, destroySession };
}
