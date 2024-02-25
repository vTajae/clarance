import {
  useDispatch
} from "/build/_shared/chunk-XQZ2HSLL.js";
import {
  setLogout
} from "/build/_shared/chunk-EB64VCHI.js";
import {
  Link,
  useFetcher
} from "/build/_shared/chunk-FSHJZDJN.js";
import {
  useNavigate
} from "/build/_shared/chunk-E5WO37RD.js";
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

// app/components/base/navigation.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/base/navigation.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/base/navigation.tsx"
  );
  import.meta.hot.lastModified = "1708672520855.668";
}
var Navigation = ({
  context
}) => {
  _s();
  const fetcher = useFetcher();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    fetcher.submit({}, {
      method: "post",
      action: "/logout"
    });
    dispatch(setLogout());
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { className: "bg-white shadow-md py-4 px-5", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", { className: "flex space-x-4", children: !context.isLoggedIn ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/login", prefetch: "intent", children: "Login" }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 47,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 46,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/register", prefetch: "intent", children: "Register" }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 52,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 51,
      columnNumber: 15
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/navigation.tsx",
    lineNumber: 45,
    columnNumber: 34
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { className: "text-blue-600 hover:text-blue-800 font-semibold", to: "/info", prefetch: "intent", children: "Info" }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 67,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 66,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "text-red-600 hover:text-red-800 font-semibold", onClick: handleLogout, children: "Logout" }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 71,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "app/components/base/navigation.tsx",
      lineNumber: 70,
      columnNumber: 15
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/navigation.tsx",
    lineNumber: 56,
    columnNumber: 19
  }, this) }, void 0, false, {
    fileName: "app/components/base/navigation.tsx",
    lineNumber: 44,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/base/navigation.tsx",
    lineNumber: 43,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/base/navigation.tsx",
    lineNumber: 42,
    columnNumber: 10
  }, this);
};
_s(Navigation, "WwTP5d0qfV9mRL68G6j1ssfWzhQ=", false, function() {
  return [useFetcher, useDispatch, useNavigate];
});
_c = Navigation;
var navigation_default = Navigation;
var _c;
$RefreshReg$(_c, "Navigation");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/base/header.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/base/header.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/base/header.tsx"
  );
  import.meta.hot.lastModified = "1708672520855.668";
}
var Header = ({
  context
}) => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("header", { className: "header-content", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(navigation_default, { context }, void 0, false, {
    fileName: "app/components/base/header.tsx",
    lineNumber: 33,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/base/header.tsx",
    lineNumber: 32,
    columnNumber: 10
  }, this);
};
_c2 = Header;
var header_default = Header;
var _c2;
$RefreshReg$(_c2, "Header");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/base/footer.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/base/footer.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/base/footer.tsx"
  );
  import.meta.hot.lastModified = "1708672520855.668";
}
var Footer = () => {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("footer", { className: "bg-gray-800 text-white p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "container mx-auto flex justify-between items-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { href: "/info/terms", className: "text-white hover:text-gray-300 mr-4", children: "Terms of Service" }, void 0, false, {
      fileName: "app/components/base/footer.tsx",
      lineNumber: 27,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("a", { href: "/info/privacy", className: "text-white hover:text-gray-300", children: "Privacy Policy" }, void 0, false, {
      fileName: "app/components/base/footer.tsx",
      lineNumber: 30,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/footer.tsx",
    lineNumber: 26,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/base/footer.tsx",
    lineNumber: 24,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/base/footer.tsx",
    lineNumber: 23,
    columnNumber: 10
  }, this);
};
_c3 = Footer;
var footer_default = Footer;
var _c3;
$RefreshReg$(_c3, "Footer");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/base/pageTemplate.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/base/pageTemplate.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/base/pageTemplate.tsx"
  );
  import.meta.hot.lastModified = "1708672520855.668";
}
var PageTemplate = ({
  children,
  user,
  context
}) => {
  if (context.isLoading === true || context.isLoading === null) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("header", { className: "header-content", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "loader", children: "Loading..." }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 34,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 33,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "flex flex-col min-h-screen", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "py-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(header_default, { user, context }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 39,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("main", { className: "main-content flex-grow py-8 max-w-7xl px-4 sm:px-6 lg:px-8", children }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(footer_default, {}, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 45,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/base/pageTemplate.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/base/pageTemplate.tsx",
    lineNumber: 37,
    columnNumber: 10
  }, this);
};
_c4 = PageTemplate;
var pageTemplate_default = PageTemplate;
var _c4;
$RefreshReg$(_c4, "PageTemplate");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/base/userStatus.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
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
var _s2 = $RefreshSig$();
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
  _s2();
  const [date, setDate] = (0, import_react2.useState)("");
  const [time, setTime] = (0, import_react2.useState)("");
  (0, import_react2.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "max-w-lg mx-auto p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg", children: context.isLoggedIn && user.id ? /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_jsx_dev_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "text-lg font-semibold text-white", children: [
      "Welcome, ",
      user.username
    ] }, void 0, true, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 47,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 49,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: time }, void 0, false, {
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
  }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(import_jsx_dev_runtime5.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "text-lg font-semibold text-red-600", children: "Not logged in" }, void 0, false, {
      fileName: "app/components/base/userStatus.tsx",
      lineNumber: 53,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { className: "mt-2 text-sm text-gray-400", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: date }, void 0, false, {
        fileName: "app/components/base/userStatus.tsx",
        lineNumber: 55,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)("div", { children: time }, void 0, false, {
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
_s2(UserStatus, "ahYO5VB7ACc7oebNEqp8a+pRg3o=");
_c5 = UserStatus;
var userStatus_default = UserStatus;
var _c5;
$RefreshReg$(_c5, "UserStatus");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

export {
  pageTemplate_default,
  userStatus_default
};
//# sourceMappingURL=/build/_shared/chunk-DSHWOZZD.js.map
