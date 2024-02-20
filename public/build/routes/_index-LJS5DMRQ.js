import {
  header_default,
  navigation_default,
  useDispatch,
  useTypedSelector
} from "/build/_shared/chunk-JDQT74M6.js";
import "/build/_shared/chunk-3VF2BKVT.js";
import "/build/_shared/chunk-XXQJOG4O.js";
import "/build/_shared/chunk-JSTWQ2ZC.js";
import "/build/_shared/chunk-H36SQQE5.js";
import {
  createHotContext
} from "/build/_shared/chunk-6OUMGZ45.js";
import "/build/_shared/chunk-N4FG5RPV.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-JKUASME7.js";
import "/build/_shared/chunk-TVZC3ZTX.js";
import {
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// app/routes/_index.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_index.tsx"
  );
  import.meta.hot.lastModified = "1708461971875.012";
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
  const dispatch = useDispatch();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(header_default, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(navigation_default, {}, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 78,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 77,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 76,
    columnNumber: 10
  }, this);
}
_s(Index, "vSJk+S806UHaaLDQMF6Cs7/Opgc=", false, function() {
  return [useTypedSelector, useDispatch];
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
//# sourceMappingURL=/build/routes/_index-LJS5DMRQ.js.map
