				import worker, * as OTHER_EXPORTS from "/home/runmy/Desktop/clarance/.wrangler/tmp/pages-kK9EY1/0lvhg0r4174b.js";
				import * as __MIDDLEWARE_0__ from "/home/runmy/Desktop/clarance/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
import * as __MIDDLEWARE_1__ from "/home/runmy/Desktop/clarance/node_modules/wrangler/templates/middleware/middleware-serve-static-assets.ts";
				const envWrappers = [__MIDDLEWARE_0__.wrap,__MIDDLEWARE_1__.wrap].filter(Boolean);
				const facade = {
					...worker,
					envWrappers,
					middleware: [
						__MIDDLEWARE_0__.default,__MIDDLEWARE_1__.default,
            ...(worker.middleware ? worker.middleware : []),
					].filter(Boolean)
				}
				export * from "/home/runmy/Desktop/clarance/.wrangler/tmp/pages-kK9EY1/0lvhg0r4174b.js";

				const maskDurableObjectDefinition = (cls) =>
					class extends cls {
						constructor(state, env) {
							let wrappedEnv = env
							for (const wrapFn of envWrappers) {
								wrappedEnv = wrapFn(wrappedEnv)
							}
							super(state, wrappedEnv);
						}
					};
				

				export default facade;