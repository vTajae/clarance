import { onRequest as __auth_home_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/auth/home.ts"
import { onRequest as __auth_login_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/auth/login.ts"
import { onRequest as __auth_logout_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/auth/logout.ts"
import { onRequest as __auth_root_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/auth/root.ts"
import { onRequest as __greet_ts_onRequest } from "/home/runmy/Desktop/clarance/functions/greet.ts"
import { onRequest as ____path___js_onRequest } from "/home/runmy/Desktop/clarance/functions/[[path]].js"

export const routes = [
    {
      routePath: "/auth/home",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_home_ts_onRequest],
    },
  {
      routePath: "/auth/login",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_login_ts_onRequest],
    },
  {
      routePath: "/auth/logout",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_logout_ts_onRequest],
    },
  {
      routePath: "/auth/root",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_root_ts_onRequest],
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