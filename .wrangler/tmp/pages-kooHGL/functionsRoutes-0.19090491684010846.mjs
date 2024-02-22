import { onRequest as __auth_home_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/auth/home.ts"
import { onRequest as __auth_root_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/auth/root.ts"
import { onRequestGet as __login_ts_onRequestGet } from "/home/runmy/Desktop/clarance-says/functions/login.ts"
import { onRequestPost as __login_ts_onRequestPost } from "/home/runmy/Desktop/clarance-says/functions/login.ts"
import { onRequest as __greet_ts_onRequest } from "/home/runmy/Desktop/clarance-says/functions/greet.ts"
import { onRequest as ____path___js_onRequest } from "/home/runmy/Desktop/clarance-says/functions/[[path]].js"

export const routes = [
    {
      routePath: "/auth/home",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_home_ts_onRequest],
    },
  {
      routePath: "/auth/root",
      mountPath: "/auth",
      method: "",
      middlewares: [],
      modules: [__auth_root_ts_onRequest],
    },
  {
      routePath: "/login",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__login_ts_onRequestGet],
    },
  {
      routePath: "/login",
      mountPath: "/",
      method: "POST",
      middlewares: [],
      modules: [__login_ts_onRequestPost],
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