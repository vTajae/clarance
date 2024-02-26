import {
  require_cloudflare
} from "/build/_shared/chunk-GSWGJEGV.js";
import {
  Link,
  useLoaderData
} from "/build/_shared/chunk-FSHJZDJN.js";
import "/build/_shared/chunk-E5WO37RD.js";
import "/build/_shared/chunk-H36SQQE5.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-JKUASME7.js";
import "/build/_shared/chunk-TVZC3ZTX.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";
import "/build/_shared/chunk-N4FG5RPV.js";
import {
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// app/routes/$404.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/$404.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/$404.tsx"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
var NotFoundPage = () => {
  _s();
  const data = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-800 mb-4", children: "404: Page Not Found" }, void 0, false, {
      fileName: "app/routes/$404.tsx",
      lineNumber: 43,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-lg text-gray-600 mb-6", children: [
      "The requested URL ",
      data.pathname,
      " was not found on this server."
    ] }, void 0, true, {
      fileName: "app/routes/$404.tsx",
      lineNumber: 44,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/", className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110", children: "Go to Home" }, void 0, false, {
      fileName: "app/routes/$404.tsx",
      lineNumber: 45,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/$404.tsx",
    lineNumber: 42,
    columnNumber: 10
  }, this);
};
_s(NotFoundPage, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = NotFoundPage;
var __default = NotFoundPage;
var _c;
$RefreshReg$(_c, "NotFoundPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  __default as default
};
//# sourceMappingURL=/build/routes/$404-XUUWW76Z.js.map
