import { checkAuthentication } from "~/utils/checkAuthentication";

// In root.ts (Cloudflare Worker)
export async function onRequest(context: any) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/login') {
    return next(request);
  }

  const isAuthenticated = await checkAuthentication(context); // Use the same function as in root loader

  if (isAuthenticated) {
    return next(request);
  } else {
    return Response.redirect(new URL('/login', request.url).toString());
  }
}
