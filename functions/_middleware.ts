// function getCorsHeaders() {
//   return {
//     'Access-Control-Allow-Origin': '*', // Adjust as needed for production
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
//     'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
//     'Access-Control-Max-Age': '86400', // 24 hours
//   };
// }

// export const onRequestOptions: PagesFunction = async () => {
//   return new Response(null, {
//     status: 204,
//     headers: getCorsHeaders(),
//   });
// };

// export const onRequest: PagesFunction = async (context) => {
//   const response = await context.next();
//   Object.entries(getCorsHeaders()).forEach(([key, value]) => {
//     response.headers.set(key, value);
//   });
//   return response;
// };


import cloudflareAccessPlugin from "@cloudflare/pages-plugin-cloudflare-access";

// export const onRequest: PagesFunction = cloudflareAccessPlugin({
//   domain: "https://test.cloudflareaccess.com",
//   aud: "4714c1358e65fe4b408ad6d432a5f878f08194bdb4752441fd56faefa9b2b6f2",
// });