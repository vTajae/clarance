import { onRequest as __auth_home_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/auth/home.ts"
import { onRequest as __greet_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/greet.ts"
import { onRequest as ____path___js_onRequest } from "/home/runmy/Desktop/clarance-says/functions/[[path]].js"
import { onRequest as ___middleware_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/_middleware.ts"

export const routes = [
    {
      routePath: "/auth/home",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_home_ts_onRequest],
    },
  {
      routePath: "/greet",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__greet_ts_onRequest],
    },
  {
      routePath: "/:path*",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [____path___js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]