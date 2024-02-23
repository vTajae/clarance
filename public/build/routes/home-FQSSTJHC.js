import "/build/_shared/chunk-FSHJZDJN.js";
import {
  Outlet
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

// app/routes/home.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/home.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/home.tsx"
  );
  import.meta.hot.lastModified = "1708660103174.726";
}
var Home = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/home.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    "Hello"
  ] }, void 0, true, {
    fileName: "app/routes/home.tsx",
    lineNumber: 24,
    columnNumber: 10
  }, this);
};
_c = Home;
var home_default = Home;
var _c;
$RefreshReg$(_c, "Home");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  home_default as default
};
//# sourceMappingURL=/build/routes/home-FQSSTJHC.js.map
