import {
  userStatus_default
} from "/build/_shared/chunk-YWHKITJJ.js";
import {
  pageTemplate_default
} from "/build/_shared/chunk-7GR4HX5H.js";
import {
  useTypedSelector
} from "/build/_shared/chunk-XQZ2HSLL.js";
import "/build/_shared/chunk-EB64VCHI.js";
import "/build/_shared/chunk-JVVCMFL4.js";
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

// app/routes/api.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/api.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/api.tsx"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
var meta = () => {
  return [{
    title: "New Remix App"
  }, {
    name: "description",
    content: "Welcome to Remix!"
  }];
};
function Index() {
  _s();
  const user = useTypedSelector((state) => state.user.value);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(pageTemplate_default, { user, children: [
    user.user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(userStatus_default, { user }, void 0, false, {
      fileName: "app/routes/api.tsx",
      lineNumber: 38,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/api.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/api.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
}
_s(Index, "v3qV7PY5E0FZP8scRNE3MqC5AFE=", false, function() {
  return [useTypedSelector];
});
_c = Index;
var _c;
$RefreshReg$(_c, "Index");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Index as default,
  meta
};
//# sourceMappingURL=/build/routes/api-5WOADCSZ.js.map
