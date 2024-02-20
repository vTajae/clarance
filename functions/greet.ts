import type { PluginData } from "@cloudflare/pages-plugin-cloudflare-access";
import { getIdentity } from "@cloudflare/pages-plugin-cloudflare-access/api";


interface Env {
    theform: KVNamespace;
  }

  export const onRequest: PagesFunction<Env> = async (context) => {

    let test = '<html><head><title>Test</title></head><body><h1>Test</h1></body></html>';

    await context.env.theform.put("html", test);

    const task = await context.env.theform.get("html");

    return new Response(task);
  }
// export const onRequest: PagesFunction<PluginData> = async ({
//   data, context
// }) => {

//     const task = await context.env.TODO_LIST.get("Task:123");


//   const identity = await getIdentity({
//     jwt: "eyJhbGciOiJIUzI1NiIsImtpZCI6IjkzMzhhYmUxYmFmMmZlNDkyZjY0NmE3MzZmMjVhZmJmN2IwMjVlMzVjNjI3YmU0ZjYwYzQxNGQ0YzczMDY5YjgiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiOTdlMmFhZTEyMDEyMWY5MDJkZjhiYzk5ZmMzNDU5MTNhYjE4NmQxNzRmMzA3OWVhNzI5MjM2NzY2YjJlN2M0YSJdLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiZXhwIjoxNTE5NDE4MjE0LCJpYXQiOjE1MTkzMzE4MTUsImlzcyI6Imh0dHBzOi8vdGVzdC5jbG91ZGZsYXJlYWNjZXNzLmNvbSIsIm5vbmNlIjoiMWQ4MDgzZjcwOGE0Nzk4MjI5NmYyZDk4OTZkNzBmMjA3YTI3OTM4ZjAyNjU0MGMzOTJiOTAzZTVmZGY0ZDZlOSIsInN1YiI6ImNhNjM5YmI5LTI2YWItNDJlNS1iOWJmLTNhZWEyN2IzMzFmZCJ9.05vGt-_0Mw6WEFJF3jpaqkNb88PUMplsjzlEUvCEfnQ",
//     domain: "https://test.cloudflareaccess.com",
//   });

//   if (identity != undefined) {
//     return new Response(`Hello, ${identity.name || "service user"}!`);
//   }
//   return new Response(
//     `Hello, ${data.cloudflareAccess.JWT.payload.email || "service user"}!`
//   );
// };

  

  