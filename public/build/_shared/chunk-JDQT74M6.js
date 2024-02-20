import {
  selectIsLoading,
  setLogout,
  useDispatch,
  useSelector
} from "/build/_shared/chunk-3VF2BKVT.js";
import {
  Link,
  useFetcher
} from "/build/_shared/chunk-JSTWQ2ZC.js";
import {
  createHotContext
} from "/build/_shared/chunk-6OUMGZ45.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-JKUASME7.js";
import {
  require_react
} from "/build/_shared/chunk-TVZC3ZTX.js";
import {
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// app/state/hooks/user.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/state/hooks/user.tsx"
  );
  import.meta.hot.lastModified = "1703882956527.179";
}
var useTypedSelector = useSelector;
var useDispatch2 = () => useDispatch();

// app/components/navigation.tsx
var import_react = __toESM(require_react(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/navigation.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/navigation.tsx"
  );
  import.meta.hot.lastModified = "1703886109149.131";
}
function Navigation() {
  _s();
  const user = useTypedSelector((state) => state.user.value);
  const [date, setDate] = (0, import_react.useState)("");
  const [time, setTime] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    const setClock = (now) => {
      if (user.locale) {
        let date2 = now.toLocaleDateString(user.locale);
        let time2 = now.toLocaleTimeString(user.locale);
        setDate(date2);
        setTime(time2);
      }
    };
    setClock(/* @__PURE__ */ new Date());
    const interval = setInterval(() => setClock(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(interval);
  }, [user.locale]);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "max-w-lg mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg", children: user.isLoggedIn && user ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-lg font-semibold text-white", children: [
      "Welcome, ",
      user.user?.username
    ] }, void 0, true, {
      fileName: "app/components/navigation.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/navigation.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: time }, void 0, false, {
        fileName: "app/components/navigation.tsx",
        lineNumber: 50,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/navigation.tsx",
      lineNumber: 48,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/navigation.tsx",
    lineNumber: 46,
    columnNumber: 32
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-lg font-semibold text-red-600", children: "Not logged in" }, void 0, false, {
      fileName: "app/components/navigation.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/navigation.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: time }, void 0, false, {
        fileName: "app/components/navigation.tsx",
        lineNumber: 56,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/navigation.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/navigation.tsx",
    lineNumber: 52,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "app/components/navigation.tsx",
    lineNumber: 45,
    columnNumber: 10
  }, this);
}
_s(Navigation, "DlzghC+GUJivZy8IZilncXABvHo=", false, function() {
  return [useTypedSelector];
});
_c = Navigation;
var navigation_default = Navigation;
var _c;
$RefreshReg$(_c, "Navigation");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/header.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/header.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/header.tsx"
  );
  import.meta.hot.lastModified = "1704241244928.857";
}
function MyHeader({
  children
}) {
  _s2();
  const fetcher = useFetcher();
  const user = useTypedSelector((state) => state.user.value);
  const isLoggedIn = useTypedSelector((state) => state.user.value.isLoggedIn);
  const isLoading = useTypedSelector(selectIsLoading);
  const dispatch = useDispatch2();
  const handleLogout = () => {
    dispatch(setLogout());
    fetcher.submit({}, {
      method: "post",
      action: "/logout"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex justify-center items-center h-screen bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("span", { className: "text-xl font-medium text-gray-600", children: "Loading..." }, void 0, false, {
    fileName: "app/components/header.tsx",
    lineNumber: 52,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "app/components/header.tsx",
    lineNumber: 51,
    columnNumber: 20
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("nav", { className: "bg-white shadow-md py-4 px-5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("ul", { className: "flex space-x-4", children: !isLoggedIn ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/login", prefetch: "intent", children: "Login" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 67,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 66,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/register", prefetch: "intent", children: "Register" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 72,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 71,
        columnNumber: 19
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/header.tsx",
      lineNumber: 65,
      columnNumber: 30
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(import_jsx_dev_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/dashboard", prefetch: "intent", children: "Dashboard" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 78,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 77,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/api/plaid", prefetch: "intent", children: "plaid" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 83,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 82,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/api/quickbooks", prefetch: "intent", children: "quickbooks" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 88,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 87,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { className: "text-red-600 hover:text-red-800 font-semibold", onClick: handleLogout, children: "Logout" }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 93,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "app/components/header.tsx",
        lineNumber: 92,
        columnNumber: 19
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/header.tsx",
      lineNumber: 76,
      columnNumber: 23
    }, this) }, void 0, false, {
      fileName: "app/components/header.tsx",
      lineNumber: 55,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/components/header.tsx",
      lineNumber: 54,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("main", { className: "p-6", children }, void 0, false, {
      fileName: "app/components/header.tsx",
      lineNumber: 100,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/header.tsx",
    lineNumber: 53,
    columnNumber: 18
  }, this) }, void 0, false, {
    fileName: "app/components/header.tsx",
    lineNumber: 50,
    columnNumber: 10
  }, this);
}
_s2(MyHeader, "f0D9+PqaJmz2cr86pmdkKiVyQ3E=", false, function() {
  return [useFetcher, useTypedSelector, useTypedSelector, useTypedSelector, useDispatch2];
});
_c2 = MyHeader;
var header_default = MyHeader;
var _c2;
$RefreshReg$(_c2, "MyHeader");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  useTypedSelector,
  useDispatch2 as useDispatch,
  navigation_default,
  header_default
};
//# sourceMappingURL=/build/_shared/chunk-JDQT74M6.js.map
