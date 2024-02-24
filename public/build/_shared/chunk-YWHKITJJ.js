import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-JKUASME7.js";
import {
  require_react
} from "/build/_shared/chunk-TVZC3ZTX.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";
import {
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// app/components/base/userStatus.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/base/userStatus.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/base/userStatus.tsx"
  );
  import.meta.hot.lastModified = "1708672520855.668";
}
var UserStatus = ({
  user,
  context
}) => {
  _s();
  const [date, setDate] = (0, import_react.useState)("");
  const [time, setTime] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    const setClock = (now) => {
      if (context.locale) {
        let date2 = now.toLocaleDateString(context.locale);
        let time2 = now.toLocaleTimeString(context.locale);
        setDate(date2);
        setTime(time2);
      }
    };
    setClock(/* @__PURE__ */ new Date());
    const interval = setInterval(() => setClock(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(interval);
  }, [context.locale]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-lg mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg", children: context.isLoggedIn && user.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-lg font-semibold text-white", children: [
      "Welcome, ",
      user.username
    ] }, void 0, true, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: time }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 48,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/userStatus.tsx",
    lineNumber: 46,
    columnNumber: 38
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-lg font-semibold text-red-600", children: "Not logged in" }, void 0, false, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: time }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/userStatus.tsx",
    lineNumber: 52,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/base/userStatus.tsx",
    lineNumber: 45,
    columnNumber: 10
  }, this);
};
_s(UserStatus, "ahYO5VB7ACc7oebNEqp8a+pRg3o=");
_c = UserStatus;
var userStatus_default = UserStatus;
var _c;
$RefreshReg$(_c, "UserStatus");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  userStatus_default
};
//# sourceMappingURL=/build/_shared/chunk-YWHKITJJ.js.map
