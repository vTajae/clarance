import {
  userStatus_default
} from "/build/_shared/chunk-YEKGOIXN.js";
import {
  pageTemplate_default,
  useTypedSelector
} from "/build/_shared/chunk-KPVNLZDD.js";
import "/build/_shared/chunk-2OV7O5PJ.js";
import {
  useLoaderData
} from "/build/_shared/chunk-FSHJZDJN.js";
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

// app/routes/_auth.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth.tsx"
  );
  import.meta.hot.lastModified = "1708665994400.8958";
}
var meta = () => {
  return [{
    title: "New Remix App"
  }, {
    name: "description",
    content: "Welcome to Remix!"
  }];
};
function Auth() {
  _s();
  const {
    user
  } = useLoaderData();
  const data = useLoaderData();
  const ReduxUser = useTypedSelector((state) => state.user.value);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(pageTemplate_default, { user: ReduxUser.user, context: ReduxUser.context, children: [
    ReduxUser.user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(userStatus_default, { user: ReduxUser.user, context: ReduxUser.context }, void 0, false, {
      fileName: "app/routes/_auth.tsx",
      lineNumber: 43,
      columnNumber: 26
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/_auth.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth.tsx",
    lineNumber: 41,
    columnNumber: 10
  }, this);
}
_s(Auth, "KNatVsylTgLUE9SznTcZXfbLocw=", false, function() {
  return [useLoaderData, useLoaderData, useTypedSelector];
});
_c = Auth;
var _c;
$RefreshReg$(_c, "Auth");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Auth as default,
  meta
};
//# sourceMappingURL=/build/routes/_auth-JXSQ65DQ.js.map
