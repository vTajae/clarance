import { onRequest as __api_home_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/api/home.ts"
import { onRequest as __api_logout_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/api/logout.ts"
import { onRequest as __api_root_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/api/root.ts"
import { onRequest as __greet_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/greet.ts"
import { onRequest as ____path___js_onRequest } from "/home/runmy/Desktop/clarance/functions/[[path]].js"

export const routes = [
    {
      routePath: "/api/home",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_home_ts_onRequest],
    },
  {
      routePath: "/api/logout",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_logout_ts_onRequest],
    },
  {
      routePath: "/api/root",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_root_ts_onRequest],
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
  ]