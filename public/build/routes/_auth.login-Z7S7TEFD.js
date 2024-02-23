import {
  require_cloudflare
} from "/build/_shared/chunk-GSWGJEGV.js";
import {
  useActionData
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

// app/routes/_auth.login.tsx
var import_react = __toESM(require_react(), 1);
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth.login.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth.login.tsx"
  );
  import.meta.hot.lastModified = "1708665028272.0732";
}
var Login = () => {
  _s();
  const [username, setUsername] = (0, import_react.useState)("");
  const [password, setPassword] = (0, import_react.useState)("");
  const actionData = useActionData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { action: "/login", method: "post", className: "max-w-lg mx-auto mt-2 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-gray-300 text-base font-semibold mb-2", htmlFor: "username", children: "Email" }, void 0, false, {
        fileName: "app/routes/_auth.login.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { className: "shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500", id: "username", type: "text", name: "username", value: username, placeholder: "Enter your email", onChange: (e) => setUsername(e.target.value) }, void 0, false, {
        fileName: "app/routes/_auth.login.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth.login.tsx",
      lineNumber: 96,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-gray-300 text-base font-semibold mb-2", htmlFor: "password", children: "Password" }, void 0, false, {
        fileName: "app/routes/_auth.login.tsx",
        lineNumber: 104,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { className: "shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 mb-3 leading-tight focus:outline-none focus:border-blue-500", id: "password", type: "password", name: "password", value: password, placeholder: "Enter your password", onChange: (e) => setPassword(e.target.value) }, void 0, false, {
        fileName: "app/routes/_auth.login.tsx",
        lineNumber: 107,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth.login.tsx",
      lineNumber: 103,
      columnNumber: 9
    }, this),
    actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-red-500 text-xs italic", children: actionData.error }, void 0, false, {
      fileName: "app/routes/_auth.login.tsx",
      lineNumber: 110,
      columnNumber: 31
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between space-x-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105", type: "submit", children: "Login" }, void 0, false, {
      fileName: "app/routes/_auth.login.tsx",
      lineNumber: 113,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth.login.tsx",
      lineNumber: 112,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth.login.tsx",
    lineNumber: 95,
    columnNumber: 10
  }, this);
};
_s(Login, "R0IZcnkolwxfB7hkF6Z/nwbogqw=", false, function() {
  return [useActionData];
});
_c = Login;
var auth_login_default = Login;
var _c;
$RefreshReg$(_c, "Login");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  auth_login_default as default
};
//# sourceMappingURL=/build/routes/_auth.login-Z7S7TEFD.js.map
