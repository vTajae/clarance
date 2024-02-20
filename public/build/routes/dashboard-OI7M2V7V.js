import {
  header_default,
  navigation_default,
  useDispatch,
  useTypedSelector
} from "/build/_shared/chunk-JDQT74M6.js";
import "/build/_shared/chunk-3VF2BKVT.js";
import "/build/_shared/chunk-XXQJOG4O.js";
import {
  useLoaderData
} from "/build/_shared/chunk-JSTWQ2ZC.js";
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

// app/routes/dashboard.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/dashboard.tsx"
  );
  import.meta.hot.lastModified = "1703922327401.251";
}
function dashboard() {
  const data = useLoaderData();
  const user = useTypedSelector((state) => state.user.value);
  const dispatch = useDispatch();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(header_default, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(navigation_default, {}, void 0, false, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 74,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 73,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 72,
    columnNumber: 5
  }, this);
}
export {
  dashboard as default
};
//# sourceMappingURL=/build/routes/dashboard-OI7M2V7V.js.map
