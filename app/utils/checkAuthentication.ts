import { AppLoadContext } from "@remix-run/cloudflare";
import { createSessionStorage } from "../utils/session/session";
import { LoginCookieData } from "api/schemas/cookie";


interface CfProperties {
  clientTcpRtt: number;
  longitude: string;
  latitude: string;
  tlsCipher: string;
  continent: string;
  asn: number;
  clientAcceptEncoding: string;
  country: string;
  tlsClientRandom: string;
  tlsClientAuth: object;
  verifiedBotCategory: string;
  tlsExportedAuthenticator: object;
  tlsVersion: string;
  city: string;
  timezone: string;
  colo: string;
  edgeRequestKeepAliveStatus: number;
  postalCode: string;
  tlsClientHelloLength: string;
  region: string;
  httpProtocol: string;
  regionCode: string;
  asOrganization: string;
  metroCode: string;
  requestPriority: string;
  botManagement: object;
}


interface CustomRequest{
  keepalive: boolean;
  integrity: string;
  cf: CfProperties;
  signal: AbortSignal;
  fetcher: object;
  redirect: string;
  headers: Headers;
  url: string;
  method: string;
  bodyUsed: boolean;
  body: null | ReadableStream<Uint8Array>;
}


interface EnvWithKV {
  USER_SESSION_SECRET: string;
  USER_COOKIE_SECRET: string;
  ASSETS: object;
  theform: KVNamespace;
  __STATIC_CONTENT: KVNamespace;
}


interface RequestContext {
  request: Request;
  env: EnvWithKV;
}

export async function checkAuthentication(context: RequestContext): Promise<LoginCookieData | false> {

  console.log(context, "contexttt")
  let session = await createSessionStorage(context.env).getSession(context.request.headers.get("Cookie"));


  console.log("CheckSession", session.data.auth);
  if (session.has("auth")) {
    try {
      // Your authentication logic here

      const parsedCookieData: LoginCookieData = session.get(
        "auth"
      ) as LoginCookieData;

      console.log("parsedCookieData", parsedCookieData);

      // const hardcodedUserData: LoginCookieData = {
      //   username: "testUser",
      //   id: "123456",
      //   accessToken: "hardcodedAccessToken",
      //   refreshToken: "hardcodedRefreshToken",
      //   tokenCreationTime: Date.now(),
      // };

      return parsedCookieData;
    } catch (error) {
      console.error("Error parsing cookie data:", error);
    }
  }
  return false;
}
