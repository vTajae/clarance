import {
  Outlet,
  init_dist2 as init_dist
} from "/build/_shared/chunk-E5WO37RD.js";
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

// app/routes/info._index.tsx
init_dist();
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/info._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/info._index.tsx"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
var Info_Index = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex justify-center space-x-4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/info/privacy", className: "block bg-white shadow-md rounded-lg p-6 max-w-sm hover:bg-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Privacy Policy" }, void 0, false, {
        fileName: "app/routes/info._index.tsx",
        lineNumber: 26,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Read our privacy policy to understand how we handle your data." }, void 0, false, {
        fileName: "app/routes/info._index.tsx",
        lineNumber: 29,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/info._index.tsx",
      lineNumber: 25,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/info/terms", className: "block bg-white shadow-md rounded-lg p-6 max-w-sm hover:bg-gray-100", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Terms of Service" }, void 0, false, {
        fileName: "app/routes/info._index.tsx",
        lineNumber: 35,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "Review our terms of service to learn about the rules and regulations." }, void 0, false, {
        fileName: "app/routes/info._index.tsx",
        lineNumber: 38,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/info._index.tsx",
      lineNumber: 34,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/info._index.tsx",
      lineNumber: 43,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/info._index.tsx",
    lineNumber: 24,
    columnNumber: 10
  }, this);
};
_c = Info_Index;
var info_index_default = Info_Index;
var _c;
$RefreshReg$(_c, "Info_Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  info_index_default as default
};
//# sourceMappingURL=/build/routes/info._index-R55ZT443.js.map
