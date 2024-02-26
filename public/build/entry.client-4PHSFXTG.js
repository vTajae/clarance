import {
  require_client
} from "/build/_shared/chunk-JXHNNPNR.js";
import {
  initializeStore
} from "/build/_shared/chunk-GYLQYPPK.js";
import "/build/_shared/chunk-EB64VCHI.js";
import {
  Provider_default
} from "/build/_shared/chunk-JVVCMFL4.js";
import {
  RemixBrowser
} from "/build/_shared/chunk-FSHJZDJN.js";
import "/build/_shared/chunk-E5WO37RD.js";
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

// app/entry.client.tsx
var import_client = __toESM(require_client(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/entry.client.tsx"
  );
  import.meta.hot.lastModified = "1703900857585.545";
}
var store = initializeStore(window.__PRELOADED_STATE__);
(0, import_client.hydrateRoot)(
  document,
  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Provider_default, { store, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(RemixBrowser, {}, void 0, false, {
    fileName: "app/entry.client.tsx",
    lineNumber: 26,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/entry.client.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "app/entry.client.tsx",
    lineNumber: 24,
    columnNumber: 3
  }, this)
);
//# sourceMappingURL=/build/entry.client-4PHSFXTG.js.map
