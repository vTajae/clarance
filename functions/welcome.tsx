// import ReactDOMServer from "react-dom/server";
// import MyComponent from "~/components/MyComponent";

// export async function onRequest() {
//   const reactHtml = ReactDOMServer.renderToString(<MyComponent />);
//   const html = `<!DOCTYPE html>
// 		<html>
// 		<head>
// 			<title>React SSR on Cloudflare</title>
// 		</head>
// 		<body>
// 		  ${reactHtml}
// 		</body>
// 		</html>`;

//   return new Response(html, {
//     headers: {
//       "content-type": "text/html;charset=UTF-8",
//     },
//   });
// }
