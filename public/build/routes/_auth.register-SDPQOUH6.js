import {
  pageTemplate_default
} from "/build/_shared/chunk-7GR4HX5H.js";
import {
  useTypedSelector
} from "/build/_shared/chunk-XQZ2HSLL.js";
import {
  require_cloudflare
} from "/build/_shared/chunk-GSWGJEGV.js";
import "/build/_shared/chunk-EB64VCHI.js";
import "/build/_shared/chunk-JVVCMFL4.js";
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

// app/routes/_auth.register.tsx
var import_react = __toESM(require_react(), 1);
var import_cloudflare = __toESM(require_cloudflare(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_auth.register.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_auth.register.tsx"
  );
  import.meta.hot.lastModified = "1708672520859.668";
}
var Register = () => {
  _s();
  const [username, setUsername] = (0, import_react.useState)("");
  const [password, setPassword] = (0, import_react.useState)("");
  const actionData = useActionData();
  const [hasAgreedToTerms, setHasAgreedToTerms] = (0, import_react.useState)(false);
  const user = useTypedSelector((state) => state.user.value);
  const handleCheckboxChange = (event) => {
    setHasAgreedToTerms(event.target.checked);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(pageTemplate_default, { user, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", { action: "/register", method: "post", className: "max-w-lg mx-auto mt-2 p-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-gray-300 text-base font-semibold mb-2", htmlFor: "username", children: "Email" }, void 0, false, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { className: "shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 leading-tight focus:outline-none focus:border-blue-500", id: "username", type: "text", name: "username", value: username, placeholder: "Enter your email", onChange: (e) => setUsername(e.target.value) }, void 0, false, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 96,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-gray-300 text-base font-semibold mb-2", htmlFor: "password", children: "Password" }, void 0, false, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 104,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { className: "shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-3 px-4 text-white bg-gray-800 mb-3 leading-tight focus:outline-none focus:border-blue-500", id: "password", type: "password", name: "password", value: password, placeholder: "Enter your password", onChange: (e) => setPassword(e.target.value) }, void 0, false, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 107,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 103,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "termsOfService", className: "block text-gray-300 text-base font-semibold mb-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", id: "termsOfService", checked: hasAgreedToTerms, onChange: handleCheckboxChange, className: "mr-2 leading-tight" }, void 0, false, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 112,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-white", children: [
        "I have read and agree to the ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("br", {}, void 0, false, {
          fileName: "app/routes/_auth.register.tsx",
          lineNumber: 114,
          columnNumber: 44
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/info/terms", target: "_blank", className: "text-blue-500 hover:text-blue-700", style: {
          margin: "0 5px"
        }, children: "Terms of Service" }, void 0, false, {
          fileName: "app/routes/_auth.register.tsx",
          lineNumber: 115,
          columnNumber: 15
        }, this),
        "and",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", { href: "/info/privacy", target: "_blank", className: "text-blue-500 hover:text-blue-700", style: {
          margin: "0 5px"
        }, children: "Privacy Policy" }, void 0, false, {
          fileName: "app/routes/_auth.register.tsx",
          lineNumber: 121,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 113,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 111,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 110,
      columnNumber: 9
    }, this),
    actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-red-500 text-xs italic", children: actionData.error }, void 0, false, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 130,
      columnNumber: 31
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
      "button",
      {
        className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105",
        type: "submit",
        disabled: !hasAgreedToTerms,
        children: "Register"
      },
      void 0,
      false,
      {
        fileName: "app/routes/_auth.register.tsx",
        lineNumber: 132,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "app/routes/_auth.register.tsx",
      lineNumber: 131,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_auth.register.tsx",
    lineNumber: 95,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/_auth.register.tsx",
    lineNumber: 94,
    columnNumber: 10
  }, this);
};
_s(Register, "M3Tm1lzI0T7huwGs9TL215w35Ho=", false, function() {
  return [useActionData, useTypedSelector];
});
_c = Register;
var auth_register_default = Register;
var _c;
$RefreshReg$(_c, "Register");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  auth_register_default as default
};
//# sourceMappingURL=/build/routes/_auth.register-SDPQOUH6.js.map
