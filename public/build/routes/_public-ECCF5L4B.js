import {
  pageTemplate_default,
  userStatus_default
} from "/build/_shared/chunk-DSHWOZZD.js";
import {
  useDispatch,
  useTypedSelector
} from "/build/_shared/chunk-XQZ2HSLL.js";
import {
  require_cloudflare
} from "/build/_shared/chunk-GSWGJEGV.js";
import {
  setLogout,
  setUser
} from "/build/_shared/chunk-EB64VCHI.js";
import "/build/_shared/chunk-JVVCMFL4.js";
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
import {
  require_react
} from "/build/_shared/chunk-TVZC3ZTX.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";
import "/build/_shared/chunk-N4FG5RPV.js";
import {
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// app/routes/_public.tsx
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_public.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_public.tsx"
  );
  import.meta.hot.lastModified = "1708880363400.907";
}
var meta = () => {
  return [{
    title: "New Remix App"
  }, {
    name: "description",
    content: "Welcome to Remix!"
  }];
};
function Public() {
  _s();
  const {
    user
  } = useLoaderData();
  const ReduxUser = useTypedSelector((state) => state.user.value);
  const dispatch = useDispatch();
  (0, import_react2.useEffect)(() => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLogout());
    }
  }, [user, dispatch]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(pageTemplate_default, { user: ReduxUser.user, context: ReduxUser.context, children: ReduxUser.context.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: "Loading..." }, void 0, false, {
    fileName: "app/routes/_public.tsx",
    lineNumber: 82,
    columnNumber: 38
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    ReduxUser.user && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(userStatus_default, { user: ReduxUser.user, context: ReduxUser.context }, void 0, false, {
      fileName: "app/routes/_public.tsx",
      lineNumber: 83,
      columnNumber: 30
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
      fileName: "app/routes/_public.tsx",
      lineNumber: 84,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_public.tsx",
    lineNumber: 82,
    columnNumber: 62
  }, this) }, void 0, false, {
    fileName: "app/routes/_public.tsx",
    lineNumber: 81,
    columnNumber: 10
  }, this);
}
_s(Public, "f6jr5OCWJu5zVZGtD+8HJe7tsAE=", false, function() {
  return [useLoaderData, useTypedSelector, useDispatch];
});
_c = Public;
var _c;
$RefreshReg$(_c, "Public");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Public as default,
  meta
};
//# sourceMappingURL=/build/routes/_public-ECCF5L4B.js.map
