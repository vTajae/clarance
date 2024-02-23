export interface EnvWithKV {
  USER_SESSION_SECRET: string;
  USER_COOKIE_SECRET: string;
  ASSETS: object;
  theform: KVNamespace;
  __STATIC_CONTENT: KVNamespace;
}

export interface RequestContext {
  request: Request;
  env: EnvWithKV;
}
