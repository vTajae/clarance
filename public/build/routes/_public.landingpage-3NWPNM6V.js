import {
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

// app/routes/_public.landingpage.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_public.landingpage.tsx"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
function dashboard() {
  const data = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-100 p-10", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-700 mb-6", children: "Landing Page" }, void 0, false, {
      fileName: "app/routes/_public.landingpage.tsx",
      lineNumber: 33,
      columnNumber: 9
    }, this),
    data.user?.username
  ] }, void 0, true, {
    fileName: "app/routes/_public.landingpage.tsx",
    lineNumber: 32,
    columnNumber: 7
  }, this);
}
export {
  dashboard as default
};
//# sourceMappingURL=/build/routes/_public.landingpage-3NWPNM6V.js.map
