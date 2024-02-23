import {
  AbortedDeferredError,
  Await,
  DataRouterContext,
  DataRouterStateContext,
  DeferredData,
  ErrorResponseImpl,
  Link,
  NavLink,
  RouterProvider,
  createBrowserHistory,
  createRouter,
  defer,
  dist_exports,
  dist_exports2,
  init_dist,
  init_dist2,
  init_router,
  isRouteErrorResponse,
  json,
  mapRouteProperties,
  matchRoutes,
  parsePath,
  redirect,
  redirectDocument,
  router_exports,
  useActionData,
  useAsyncError,
  useFetcher,
  useHref,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
  useScrollRestoration
} from "/build/_shared/chunk-E5WO37RD.js";
import {
  require_react
} from "/build/_shared/chunk-TVZC3ZTX.js";
import {
  createHotContext
} from "/build/_shared/chunk-4FV6DEOC.js";
import {
  __commonJS,
  __toCommonJS,
  __toESM
} from "/build/_shared/chunk-RODUX5XG.js";

// node_modules/react-router-dom/server.js
var require_server = __commonJS({
  "node_modules/react-router-dom/server.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var React8 = require_react();
    var router2 = (init_router(), __toCommonJS(router_exports));
    var reactRouter = (init_dist(), __toCommonJS(dist_exports));
    var reactRouterDom = (init_dist2(), __toCommonJS(dist_exports2));
    function _interopNamespace(e) {
      if (e && e.__esModule)
        return e;
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var React__namespace = /* @__PURE__ */ _interopNamespace(React8);
    function StaticRouter({
      basename,
      children,
      location: locationProp = "/",
      future
    }) {
      if (typeof locationProp === "string") {
        locationProp = reactRouterDom.parsePath(locationProp);
      }
      let action = router2.Action.Pop;
      let location = {
        pathname: locationProp.pathname || "/",
        search: locationProp.search || "",
        hash: locationProp.hash || "",
        state: locationProp.state || null,
        key: locationProp.key || "default"
      };
      let staticNavigator = getStatelessNavigator();
      return /* @__PURE__ */ React__namespace.createElement(reactRouterDom.Router, {
        basename,
        children,
        location,
        navigationType: action,
        navigator: staticNavigator,
        future,
        static: true
      });
    }
    function StaticRouterProvider2({
      context,
      router: router$1,
      hydrate = true,
      nonce
    }) {
      !(router$1 && context) ? true ? router2.UNSAFE_invariant(false, "You must provide `router` and `context` to <StaticRouterProvider>") : router2.UNSAFE_invariant(false) : void 0;
      let dataRouterContext = {
        router: router$1,
        navigator: getStatelessNavigator(),
        static: true,
        staticContext: context,
        basename: context.basename || "/"
      };
      let fetchersContext = /* @__PURE__ */ new Map();
      let hydrateScript = "";
      if (hydrate !== false) {
        let data = {
          loaderData: context.loaderData,
          actionData: context.actionData,
          errors: serializeErrors(context.errors)
        };
        let json3 = htmlEscape(JSON.stringify(JSON.stringify(data)));
        hydrateScript = `window.__staticRouterHydrationData = JSON.parse(${json3});`;
      }
      let {
        state
      } = dataRouterContext.router;
      return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement(reactRouterDom.UNSAFE_DataRouterContext.Provider, {
        value: dataRouterContext
      }, /* @__PURE__ */ React__namespace.createElement(reactRouterDom.UNSAFE_DataRouterStateContext.Provider, {
        value: state
      }, /* @__PURE__ */ React__namespace.createElement(reactRouterDom.UNSAFE_FetchersContext.Provider, {
        value: fetchersContext
      }, /* @__PURE__ */ React__namespace.createElement(reactRouterDom.UNSAFE_ViewTransitionContext.Provider, {
        value: {
          isTransitioning: false
        }
      }, /* @__PURE__ */ React__namespace.createElement(reactRouterDom.Router, {
        basename: dataRouterContext.basename,
        location: state.location,
        navigationType: state.historyAction,
        navigator: dataRouterContext.navigator,
        static: dataRouterContext.static,
        future: {
          v7_relativeSplatPath: router$1.future.v7_relativeSplatPath
        }
      }, /* @__PURE__ */ React__namespace.createElement(DataRoutes, {
        routes: router$1.routes,
        future: router$1.future,
        state
      })))))), hydrateScript ? /* @__PURE__ */ React__namespace.createElement("script", {
        suppressHydrationWarning: true,
        nonce,
        dangerouslySetInnerHTML: {
          __html: hydrateScript
        }
      }) : null);
    }
    function DataRoutes({
      routes,
      future,
      state
    }) {
      return reactRouter.UNSAFE_useRoutesImpl(routes, void 0, state, future);
    }
    function serializeErrors(errors) {
      if (!errors)
        return null;
      let entries = Object.entries(errors);
      let serialized = {};
      for (let [key, val] of entries) {
        if (router2.isRouteErrorResponse(val)) {
          serialized[key] = {
            ...val,
            __type: "RouteErrorResponse"
          };
        } else if (val instanceof Error) {
          serialized[key] = {
            message: val.message,
            __type: "Error",
            // If this is a subclass (i.e., ReferenceError), send up the type so we
            // can re-create the same type during hydration.
            ...val.name !== "Error" ? {
              __subType: val.name
            } : {}
          };
        } else {
          serialized[key] = val;
        }
      }
      return serialized;
    }
    function getStatelessNavigator() {
      return {
        createHref,
        encodeLocation,
        push(to) {
          throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
        },
        replace(to) {
          throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
        },
        go(delta) {
          throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
        },
        back() {
          throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
        },
        forward() {
          throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
        }
      };
    }
    function createStaticHandler(routes, opts) {
      return router2.createStaticHandler(routes, {
        ...opts,
        mapRouteProperties: reactRouter.UNSAFE_mapRouteProperties
      });
    }
    function createStaticRouter2(routes, context, opts = {}) {
      let manifest = {};
      let dataRoutes = router2.UNSAFE_convertRoutesToDataRoutes(routes, reactRouter.UNSAFE_mapRouteProperties, void 0, manifest);
      let matches = context.matches.map((match) => {
        let route = manifest[match.route.id] || match.route;
        return {
          ...match,
          route
        };
      });
      let msg = (method) => `You cannot use router.${method}() on the server because it is a stateless environment`;
      return {
        get basename() {
          return context.basename;
        },
        get future() {
          return {
            v7_fetcherPersist: false,
            v7_normalizeFormMethod: false,
            v7_partialHydration: opts.future?.v7_partialHydration === true,
            v7_prependBasename: false,
            v7_relativeSplatPath: opts.future?.v7_relativeSplatPath === true
          };
        },
        get state() {
          return {
            historyAction: router2.Action.Pop,
            location: context.location,
            matches,
            loaderData: context.loaderData,
            actionData: context.actionData,
            errors: context.errors,
            initialized: true,
            navigation: router2.IDLE_NAVIGATION,
            restoreScrollPosition: null,
            preventScrollReset: false,
            revalidation: "idle",
            fetchers: /* @__PURE__ */ new Map(),
            blockers: /* @__PURE__ */ new Map()
          };
        },
        get routes() {
          return dataRoutes;
        },
        get window() {
          return void 0;
        },
        initialize() {
          throw msg("initialize");
        },
        subscribe() {
          throw msg("subscribe");
        },
        enableScrollRestoration() {
          throw msg("enableScrollRestoration");
        },
        navigate() {
          throw msg("navigate");
        },
        fetch() {
          throw msg("fetch");
        },
        revalidate() {
          throw msg("revalidate");
        },
        createHref,
        encodeLocation,
        getFetcher() {
          return router2.IDLE_FETCHER;
        },
        deleteFetcher() {
          throw msg("deleteFetcher");
        },
        dispose() {
          throw msg("dispose");
        },
        getBlocker() {
          return router2.IDLE_BLOCKER;
        },
        deleteBlocker() {
          throw msg("deleteBlocker");
        },
        _internalFetchControllers: /* @__PURE__ */ new Map(),
        _internalActiveDeferreds: /* @__PURE__ */ new Map(),
        _internalSetRoutes() {
          throw msg("_internalSetRoutes");
        }
      };
    }
    function createHref(to) {
      return typeof to === "string" ? to : reactRouterDom.createPath(to);
    }
    function encodeLocation(to) {
      let href = typeof to === "string" ? to : reactRouterDom.createPath(to);
      let encoded = ABSOLUTE_URL_REGEX2.test(href) ? new URL(href) : new URL(href, "http://localhost");
      return {
        pathname: encoded.pathname,
        search: encoded.search,
        hash: encoded.hash
      };
    }
    var ABSOLUTE_URL_REGEX2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
    var ESCAPE_LOOKUP2 = {
      "&": "\\u0026",
      ">": "\\u003e",
      "<": "\\u003c",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var ESCAPE_REGEX2 = /[&><\u2028\u2029]/g;
    function htmlEscape(str) {
      return str.replace(ESCAPE_REGEX2, (match) => ESCAPE_LOOKUP2[match]);
    }
    exports.StaticRouter = StaticRouter;
    exports.StaticRouterProvider = StaticRouterProvider2;
    exports.createStaticHandler = createStaticHandler;
    exports.createStaticRouter = createStaticRouter2;
  }
});

// node_modules/@remix-run/react/dist/esm/index.js
init_dist2();

// node_modules/@remix-run/server-runtime/dist/esm/responses.js
init_router();
var json2 = (data, init = {}) => {
  return json(data, init);
};
var defer2 = (data, init = {}) => {
  return defer(data, init);
};
var redirect2 = (url, init = 302) => {
  return redirect(url, init);
};
var redirectDocument2 = (url, init = 302) => {
  return redirectDocument(url, init);
};

// node_modules/@remix-run/react/dist/esm/browser.js
init_router();
var React5 = __toESM(require_react());
init_dist();
init_dist2();

// node_modules/@remix-run/react/dist/esm/_virtual/_rollupPluginBabelHelpers.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// node_modules/@remix-run/react/dist/esm/components.js
var React = __toESM(require_react());
init_dist2();

// node_modules/@remix-run/react/dist/esm/invariant.js
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}

// node_modules/@remix-run/react/dist/esm/links.js
init_dist2();

// node_modules/@remix-run/react/dist/esm/routeModules.js
async function loadRouteModule(route, routeModulesCache) {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }
  try {
    let routeModule = await import(
      /* webpackIgnore: true */
      route.module
    );
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {
    window.location.reload();
    return new Promise(() => {
    });
  }
}

// node_modules/@remix-run/react/dist/esm/links.js
function getKeyedLinksForMatches(matches, routeModules, manifest) {
  let descriptors = matches.map((match) => {
    var _module$links;
    let module = routeModules[match.route.id];
    let route = manifest.routes[match.route.id];
    return [route.css ? route.css.map((href) => ({
      rel: "stylesheet",
      href
    })) : [], ((_module$links = module.links) === null || _module$links === void 0 ? void 0 : _module$links.call(module)) || []];
  }).flat(2);
  let preloads = getCurrentPageModulePreloadHrefs(matches, manifest);
  return dedupeLinkDescriptors(descriptors, preloads);
}
async function prefetchStyleLinks(route, routeModule) {
  var _route$css, _routeModule$links;
  if (!route.css && !routeModule.links || !isPreloadSupported())
    return;
  let descriptors = [((_route$css = route.css) === null || _route$css === void 0 ? void 0 : _route$css.map((href) => ({
    rel: "stylesheet",
    href
  }))) ?? [], ((_routeModule$links = routeModule.links) === null || _routeModule$links === void 0 ? void 0 : _routeModule$links.call(routeModule)) ?? []].flat(1);
  if (descriptors.length === 0)
    return;
  let styleLinks = [];
  for (let descriptor of descriptors) {
    if (!isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet") {
      styleLinks.push({
        ...descriptor,
        rel: "preload",
        as: "style"
      });
    }
  }
  let matchingLinks = styleLinks.filter((link) => (!link.media || window.matchMedia(link.media).matches) && !document.querySelector(`link[rel="stylesheet"][href="${link.href}"]`));
  await Promise.all(matchingLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
  return new Promise((resolve) => {
    let link = document.createElement("link");
    Object.assign(link, descriptor);
    function removeLink() {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }
    link.onload = () => {
      removeLink();
      resolve();
    };
    link.onerror = () => {
      removeLink();
      resolve();
    };
    document.head.appendChild(link);
  });
}
function isPageLinkDescriptor(object) {
  return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
  if (object == null) {
    return false;
  }
  if (object.href == null) {
    return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
  }
  return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
  let links = await Promise.all(matches.map(async (match) => {
    let mod = await loadRouteModule(manifest.routes[match.route.id], routeModules);
    return mod.links ? mod.links() : [];
  }));
  return dedupeLinkDescriptors(links.flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map((link) => link.rel === "stylesheet" ? {
    ...link,
    rel: "prefetch",
    as: "style"
  } : {
    ...link,
    rel: "prefetch"
  }));
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
  let path = parsePathPatch(page);
  let isNew = (match, index) => {
    if (!currentMatches[index])
      return true;
    return match.route.id !== currentMatches[index].route.id;
  };
  let matchPathChanged = (match, index) => {
    var _currentMatches$index;
    return (
      // param change, /users/123 -> /users/456
      currentMatches[index].pathname !== match.pathname || // splat param changed, which is not present in match.path
      // e.g. /files/images/avatar.jpg -> files/finances.xls
      ((_currentMatches$index = currentMatches[index].route.path) === null || _currentMatches$index === void 0 ? void 0 : _currentMatches$index.endsWith("*")) && currentMatches[index].params["*"] !== match.params["*"]
    );
  };
  let newMatches = mode === "data" && location.search !== path.search ? (
    // this is really similar to stuff in transition.ts, maybe somebody smarter
    // than me (or in less of a hurry) can share some of it. You're the best.
    nextMatches.filter((match, index) => {
      let manifestRoute = manifest.routes[match.route.id];
      if (!manifestRoute.hasLoader) {
        return false;
      }
      if (isNew(match, index) || matchPathChanged(match, index)) {
        return true;
      }
      if (match.route.shouldRevalidate) {
        var _currentMatches$;
        let routeChoice = match.route.shouldRevalidate({
          currentUrl: new URL(location.pathname + location.search + location.hash, window.origin),
          currentParams: ((_currentMatches$ = currentMatches[0]) === null || _currentMatches$ === void 0 ? void 0 : _currentMatches$.params) || {},
          nextUrl: new URL(page, window.origin),
          nextParams: match.params,
          defaultShouldRevalidate: true
        });
        if (typeof routeChoice === "boolean") {
          return routeChoice;
        }
      }
      return true;
    })
  ) : nextMatches.filter((match, index) => {
    let manifestRoute = manifest.routes[match.route.id];
    return (mode === "assets" || manifestRoute.hasLoader) && (isNew(match, index) || matchPathChanged(match, index));
  });
  return newMatches;
}
function getDataLinkHrefs(page, matches, manifest) {
  let path = parsePathPatch(page);
  return dedupeHrefs(matches.filter((match) => manifest.routes[match.route.id].hasLoader).map((match) => {
    let {
      pathname,
      search
    } = path;
    let searchParams = new URLSearchParams(search);
    searchParams.set("_data", match.route.id);
    return `${pathname}?${searchParams}`;
  }));
}
function getModuleLinkHrefs(matches, manifestPatch) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifestPatch.routes[match.route.id];
    let hrefs = [route.module];
    if (route.imports) {
      hrefs = hrefs.concat(route.imports);
    }
    return hrefs;
  }).flat(1));
}
function getCurrentPageModulePreloadHrefs(matches, manifest) {
  return dedupeHrefs(matches.map((match) => {
    let route = manifest.routes[match.route.id];
    let hrefs = [route.module];
    if (route.imports) {
      hrefs = hrefs.concat(route.imports);
    }
    return hrefs;
  }).flat(1));
}
function dedupeHrefs(hrefs) {
  return [...new Set(hrefs)];
}
function sortKeys(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
  let set = /* @__PURE__ */ new Set();
  let preloadsSet = new Set(preloads);
  return descriptors.reduce((deduped, descriptor) => {
    let alreadyModulePreload = preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href);
    if (alreadyModulePreload) {
      return deduped;
    }
    let key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({
        key,
        link: descriptor
      });
    }
    return deduped;
  }, []);
}
function parsePathPatch(href) {
  let path = parsePath(href);
  if (path.search === void 0)
    path.search = "";
  return path;
}
var _isPreloadSupported;
function isPreloadSupported() {
  if (_isPreloadSupported !== void 0) {
    return _isPreloadSupported;
  }
  let el = document.createElement("link");
  _isPreloadSupported = el.relList.supports("preload");
  el = null;
  return _isPreloadSupported;
}

// node_modules/@remix-run/react/dist/esm/markup.js
var ESCAPE_LOOKUP = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var ESCAPE_REGEX = /[&><\u2028\u2029]/g;
function escapeHtml(html) {
  return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
function createHtml(html) {
  return {
    __html: html
  };
}

// node_modules/@remix-run/react/dist/esm/components.js
function useDataRouterContext() {
  let context = React.useContext(DataRouterContext);
  invariant(context, "You must render this element inside a <DataRouterContext.Provider> element");
  return context;
}
function useDataRouterStateContext() {
  let context = React.useContext(DataRouterStateContext);
  invariant(context, "You must render this element inside a <DataRouterStateContext.Provider> element");
  return context;
}
var RemixContext = /* @__PURE__ */ React.createContext(void 0);
RemixContext.displayName = "Remix";
function useRemixContext() {
  let context = React.useContext(RemixContext);
  invariant(context, "You must render this element inside a <Remix> element");
  return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
  let [maybePrefetch, setMaybePrefetch] = React.useState(false);
  let [shouldPrefetch, setShouldPrefetch] = React.useState(false);
  let {
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onTouchStart
  } = theirElementProps;
  let ref = React.useRef(null);
  React.useEffect(() => {
    if (prefetch === "render") {
      setShouldPrefetch(true);
    }
    if (prefetch === "viewport") {
      let callback = (entries) => {
        entries.forEach((entry) => {
          setShouldPrefetch(entry.isIntersecting);
        });
      };
      let observer = new IntersectionObserver(callback, {
        threshold: 0.5
      });
      if (ref.current)
        observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [prefetch]);
  let setIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(true);
    }
  };
  let cancelIntent = () => {
    if (prefetch === "intent") {
      setMaybePrefetch(false);
      setShouldPrefetch(false);
    }
  };
  React.useEffect(() => {
    if (maybePrefetch) {
      let id = setTimeout(() => {
        setShouldPrefetch(true);
      }, 100);
      return () => {
        clearTimeout(id);
      };
    }
  }, [maybePrefetch]);
  return [shouldPrefetch, ref, {
    onFocus: composeEventHandlers(onFocus, setIntent),
    onBlur: composeEventHandlers(onBlur, cancelIntent),
    onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
    onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
    onTouchStart: composeEventHandlers(onTouchStart, setIntent)
  }];
}
var ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
var NavLink2 = /* @__PURE__ */ React.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX.test(to);
  let href = useHref(to);
  let [shouldPrefetch, ref, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NavLink, _extends({}, props, prefetchHandlers, {
    ref: mergeRefs(forwardedRef, ref),
    to
  })), shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
NavLink2.displayName = "NavLink";
var Link2 = /* @__PURE__ */ React.forwardRef(({
  to,
  prefetch = "none",
  ...props
}, forwardedRef) => {
  let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX.test(to);
  let href = useHref(to);
  let [shouldPrefetch, ref, prefetchHandlers] = usePrefetchBehavior(prefetch, props);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Link, _extends({}, props, prefetchHandlers, {
    ref: mergeRefs(forwardedRef, ref),
    to
  })), shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React.createElement(PrefetchPageLinks, {
    page: href
  }) : null);
});
Link2.displayName = "Link";
function composeEventHandlers(theirHandler, ourHandler) {
  return (event) => {
    theirHandler && theirHandler(event);
    if (!event.defaultPrevented) {
      ourHandler(event);
    }
  };
}
function Links() {
  let {
    manifest,
    routeModules,
    criticalCss
  } = useRemixContext();
  let {
    errors,
    matches: routerMatches
  } = useDataRouterStateContext();
  let matches = errors ? routerMatches.slice(0, routerMatches.findIndex((m) => errors[m.route.id]) + 1) : routerMatches;
  let keyedLinks = React.useMemo(() => getKeyedLinksForMatches(matches, routeModules, manifest), [matches, routeModules, manifest]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, criticalCss ? /* @__PURE__ */ React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: criticalCss
    }
  }) : null, keyedLinks.map(({
    key,
    link
  }) => isPageLinkDescriptor(link) ? /* @__PURE__ */ React.createElement(PrefetchPageLinks, _extends({
    key
  }, link)) : /* @__PURE__ */ React.createElement("link", _extends({
    key
  }, link))));
}
function PrefetchPageLinks({
  page,
  ...dataLinkProps
}) {
  let {
    router: router2
  } = useDataRouterContext();
  let matches = React.useMemo(() => matchRoutes(router2.routes, page), [router2.routes, page]);
  if (!matches) {
    console.warn(`Tried to prefetch ${page} but no routes matched.`);
    return null;
  }
  return /* @__PURE__ */ React.createElement(PrefetchPageLinksImpl, _extends({
    page,
    matches
  }, dataLinkProps));
}
function useKeyedPrefetchLinks(matches) {
  let {
    manifest,
    routeModules
  } = useRemixContext();
  let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React.useState([]);
  React.useEffect(() => {
    let interrupted = false;
    void getKeyedPrefetchLinks(matches, manifest, routeModules).then((links) => {
      if (!interrupted) {
        setKeyedPrefetchLinks(links);
      }
    });
    return () => {
      interrupted = true;
    };
  }, [matches, manifest, routeModules]);
  return keyedPrefetchLinks;
}
function PrefetchPageLinksImpl({
  page,
  matches: nextMatches,
  ...linkProps
}) {
  let location = useLocation();
  let {
    manifest
  } = useRemixContext();
  let {
    matches
  } = useDataRouterStateContext();
  let newMatchesForData = React.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "data"), [page, nextMatches, matches, manifest, location]);
  let newMatchesForAssets = React.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "assets"), [page, nextMatches, matches, manifest, location]);
  let dataHrefs = React.useMemo(() => getDataLinkHrefs(page, newMatchesForData, manifest), [newMatchesForData, page, manifest]);
  let moduleHrefs = React.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest), [newMatchesForAssets, manifest]);
  let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React.createElement("link", _extends({
    key: href,
    rel: "prefetch",
    as: "fetch",
    href
  }, linkProps))), moduleHrefs.map((href) => /* @__PURE__ */ React.createElement("link", _extends({
    key: href,
    rel: "modulepreload",
    href
  }, linkProps))), keyedPrefetchLinks.map(({
    key,
    link
  }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ React.createElement("link", _extends({
      key
    }, link))
  )));
}
function Meta() {
  let {
    routeModules
  } = useRemixContext();
  let {
    errors,
    matches: routerMatches,
    loaderData
  } = useDataRouterStateContext();
  let location = useLocation();
  let _matches = routerMatches;
  let error = null;
  if (errors) {
    let errorIdx = routerMatches.findIndex((m) => errors[m.route.id]);
    _matches = routerMatches.slice(0, errorIdx + 1);
    error = errors[routerMatches[errorIdx].route.id];
  }
  let meta = [];
  let leafMeta = null;
  let matches = [];
  for (let i = 0; i < _matches.length; i++) {
    let _match = _matches[i];
    let routeId = _match.route.id;
    let data = loaderData[routeId];
    let params = _match.params;
    let routeModule = routeModules[routeId];
    let routeMeta = [];
    let match = {
      id: routeId,
      data,
      meta: [],
      params: _match.params,
      pathname: _match.pathname,
      handle: _match.route.handle,
      error
    };
    matches[i] = match;
    if (routeModule !== null && routeModule !== void 0 && routeModule.meta) {
      routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
        data,
        params,
        location,
        matches,
        error
      }) : Array.isArray(routeModule.meta) ? [...routeModule.meta] : routeModule.meta;
    } else if (leafMeta) {
      routeMeta = [...leafMeta];
    }
    routeMeta = routeMeta || [];
    if (!Array.isArray(routeMeta)) {
      throw new Error("The route at " + _match.route.path + " returns an invalid value. All route meta functions must return an array of meta objects.\n\nTo reference the meta function API, see https://remix.run/route/meta");
    }
    match.meta = routeMeta;
    matches[i] = match;
    meta = [...routeMeta];
    leafMeta = meta;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, meta.flat().map((metaProps) => {
    if (!metaProps) {
      return null;
    }
    if ("tagName" in metaProps) {
      let {
        tagName,
        ...rest
      } = metaProps;
      if (!isValidMetaTag(tagName)) {
        console.warn(`A meta object uses an invalid tagName: ${tagName}. Expected either 'link' or 'meta'`);
        return null;
      }
      let Comp = tagName;
      return /* @__PURE__ */ React.createElement(Comp, _extends({
        key: JSON.stringify(rest)
      }, rest));
    }
    if ("title" in metaProps) {
      return /* @__PURE__ */ React.createElement("title", {
        key: "title"
      }, String(metaProps.title));
    }
    if ("charset" in metaProps) {
      metaProps.charSet ??= metaProps.charset;
      delete metaProps.charset;
    }
    if ("charSet" in metaProps && metaProps.charSet != null) {
      return typeof metaProps.charSet === "string" ? /* @__PURE__ */ React.createElement("meta", {
        key: "charSet",
        charSet: metaProps.charSet
      }) : null;
    }
    if ("script:ld+json" in metaProps) {
      try {
        let json3 = JSON.stringify(metaProps["script:ld+json"]);
        return /* @__PURE__ */ React.createElement("script", {
          key: `script:ld+json:${json3}`,
          type: "application/ld+json",
          dangerouslySetInnerHTML: {
            __html: json3
          }
        });
      } catch (err) {
        return null;
      }
    }
    return /* @__PURE__ */ React.createElement("meta", _extends({
      key: JSON.stringify(metaProps)
    }, metaProps));
  }));
}
function isValidMetaTag(tagName) {
  return typeof tagName === "string" && /^(meta|link)$/.test(tagName);
}
function Await2(props) {
  return /* @__PURE__ */ React.createElement(Await, props);
}
var isHydrated = false;
function Scripts(props) {
  let {
    manifest,
    serverHandoffString,
    abortDelay,
    serializeError
  } = useRemixContext();
  let {
    router: router2,
    static: isStatic,
    staticContext
  } = useDataRouterContext();
  let {
    matches
  } = useDataRouterStateContext();
  let navigation = useNavigation();
  React.useEffect(() => {
    isHydrated = true;
  }, []);
  let serializePreResolvedErrorImp = (key, error) => {
    let toSerialize;
    if (serializeError && error instanceof Error) {
      toSerialize = serializeError(error);
    } else {
      toSerialize = error;
    }
    return `${JSON.stringify(key)}:__remixContext.p(!1, ${escapeHtml(JSON.stringify(toSerialize))})`;
  };
  let serializePreresolvedDataImp = (routeId, key, data) => {
    let serializedData;
    try {
      serializedData = JSON.stringify(data);
    } catch (error) {
      return serializePreResolvedErrorImp(key, error);
    }
    return `${JSON.stringify(key)}:__remixContext.p(${escapeHtml(serializedData)})`;
  };
  let serializeErrorImp = (routeId, key, error) => {
    let toSerialize;
    if (serializeError && error instanceof Error) {
      toSerialize = serializeError(error);
    } else {
      toSerialize = error;
    }
    return `__remixContext.r(${JSON.stringify(routeId)}, ${JSON.stringify(key)}, !1, ${escapeHtml(JSON.stringify(toSerialize))})`;
  };
  let serializeDataImp = (routeId, key, data) => {
    let serializedData;
    try {
      serializedData = JSON.stringify(data);
    } catch (error) {
      return serializeErrorImp(routeId, key, error);
    }
    return `__remixContext.r(${JSON.stringify(routeId)}, ${JSON.stringify(key)}, ${escapeHtml(serializedData)})`;
  };
  let deferredScripts = [];
  let initialScripts = React.useMemo(() => {
    var _manifest$hmr;
    let contextScript = staticContext ? `window.__remixContext = ${serverHandoffString};` : " ";
    let activeDeferreds = staticContext === null || staticContext === void 0 ? void 0 : staticContext.activeDeferreds;
    contextScript += !activeDeferreds ? "" : ["__remixContext.p = function(v,e,p,x) {", "  if (typeof e !== 'undefined') {", true ? "    x=new Error(e.message);\n    x.stack=e.stack;" : '    x=new Error("Unexpected Server Error");\n    x.stack=undefined;', "    p=Promise.reject(x);", "  } else {", "    p=Promise.resolve(v);", "  }", "  return p;", "};", "__remixContext.n = function(i,k) {", "  __remixContext.t = __remixContext.t || {};", "  __remixContext.t[i] = __remixContext.t[i] || {};", "  let p = new Promise((r, e) => {__remixContext.t[i][k] = {r:(v)=>{r(v);},e:(v)=>{e(v);}};});", typeof abortDelay === "number" ? `setTimeout(() => {if(typeof p._error !== "undefined" || typeof p._data !== "undefined"){return;} __remixContext.t[i][k].e(new Error("Server timeout."))}, ${abortDelay});` : "", "  return p;", "};", "__remixContext.r = function(i,k,v,e,p,x) {", "  p = __remixContext.t[i][k];", "  if (typeof e !== 'undefined') {", true ? "    x=new Error(e.message);\n    x.stack=e.stack;" : '    x=new Error("Unexpected Server Error");\n    x.stack=undefined;', "    p.e(x);", "  } else {", "    p.r(v);", "  }", "};"].join("\n") + Object.entries(activeDeferreds).map(([routeId, deferredData]) => {
      let pendingKeys = new Set(deferredData.pendingKeys);
      let promiseKeyValues = deferredData.deferredKeys.map((key) => {
        if (pendingKeys.has(key)) {
          deferredScripts.push(/* @__PURE__ */ React.createElement(DeferredHydrationScript, {
            key: `${routeId} | ${key}`,
            deferredData,
            routeId,
            dataKey: key,
            scriptProps: props,
            serializeData: serializeDataImp,
            serializeError: serializeErrorImp
          }));
          return `${JSON.stringify(key)}:__remixContext.n(${JSON.stringify(routeId)}, ${JSON.stringify(key)})`;
        } else {
          let trackedPromise = deferredData.data[key];
          if (typeof trackedPromise._error !== "undefined") {
            return serializePreResolvedErrorImp(key, trackedPromise._error);
          } else {
            return serializePreresolvedDataImp(routeId, key, trackedPromise._data);
          }
        }
      }).join(",\n");
      return `Object.assign(__remixContext.state.loaderData[${JSON.stringify(routeId)}], {${promiseKeyValues}});`;
    }).join("\n") + (deferredScripts.length > 0 ? `__remixContext.a=${deferredScripts.length};` : "");
    let routeModulesScript = !isStatic ? " " : `${(_manifest$hmr = manifest.hmr) !== null && _manifest$hmr !== void 0 && _manifest$hmr.runtime ? `import ${JSON.stringify(manifest.hmr.runtime)};` : ""}import ${JSON.stringify(manifest.url)};
${matches.map((match, index) => `import * as route${index} from ${JSON.stringify(manifest.routes[match.route.id].module)};`).join("\n")}
window.__remixRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest.entry.module)});`;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", _extends({}, props, {
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: createHtml(contextScript),
      type: void 0
    })), /* @__PURE__ */ React.createElement("script", _extends({}, props, {
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: createHtml(routeModulesScript),
      type: "module",
      async: true
    })));
  }, []);
  if (!isStatic && typeof __remixContext === "object" && __remixContext.a) {
    for (let i = 0; i < __remixContext.a; i++) {
      deferredScripts.push(/* @__PURE__ */ React.createElement(DeferredHydrationScript, {
        key: i,
        scriptProps: props,
        serializeData: serializeDataImp,
        serializeError: serializeErrorImp
      }));
    }
  }
  let nextMatches = React.useMemo(() => {
    if (navigation.location) {
      let matches2 = matchRoutes(router2.routes, navigation.location);
      invariant(matches2, `No routes match path "${navigation.location.pathname}"`);
      return matches2;
    }
    return [];
  }, [navigation.location, router2.routes]);
  let routePreloads = matches.concat(nextMatches).map((match) => {
    let route = manifest.routes[match.route.id];
    return (route.imports || []).concat([route.module]);
  }).flat(1);
  let preloads = isHydrated ? [] : manifest.entry.imports.concat(routePreloads);
  return isHydrated ? null : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("link", {
    rel: "modulepreload",
    href: manifest.url,
    crossOrigin: props.crossOrigin
  }), /* @__PURE__ */ React.createElement("link", {
    rel: "modulepreload",
    href: manifest.entry.module,
    crossOrigin: props.crossOrigin
  }), dedupe(preloads).map((path) => /* @__PURE__ */ React.createElement("link", {
    key: path,
    rel: "modulepreload",
    href: path,
    crossOrigin: props.crossOrigin
  })), initialScripts, deferredScripts);
}
function DeferredHydrationScript({
  dataKey,
  deferredData,
  routeId,
  scriptProps,
  serializeData,
  serializeError
}) {
  if (typeof document === "undefined" && deferredData && dataKey && routeId) {
    invariant(deferredData.pendingKeys.includes(dataKey), `Deferred data for route ${routeId} with key ${dataKey} was not pending but tried to render a script for it.`);
  }
  return /* @__PURE__ */ React.createElement(React.Suspense, {
    fallback: (
      // This makes absolutely no sense. The server renders null as a fallback,
      // but when hydrating, we need to render a script tag to avoid a hydration issue.
      // To reproduce a hydration mismatch, just render null as a fallback.
      typeof document === "undefined" && deferredData && dataKey && routeId ? null : /* @__PURE__ */ React.createElement("script", _extends({}, scriptProps, {
        async: true,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: {
          __html: " "
        }
      }))
    )
  }, typeof document === "undefined" && deferredData && dataKey && routeId ? /* @__PURE__ */ React.createElement(Await2, {
    resolve: deferredData.data[dataKey],
    errorElement: /* @__PURE__ */ React.createElement(ErrorDeferredHydrationScript, {
      dataKey,
      routeId,
      scriptProps,
      serializeError
    }),
    children: (data) => {
      return /* @__PURE__ */ React.createElement("script", _extends({}, scriptProps, {
        async: true,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: {
          __html: serializeData(routeId, dataKey, data)
        }
      }));
    }
  }) : /* @__PURE__ */ React.createElement("script", _extends({}, scriptProps, {
    async: true,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: " "
    }
  })));
}
function ErrorDeferredHydrationScript({
  dataKey,
  routeId,
  scriptProps,
  serializeError
}) {
  let error = useAsyncError();
  return /* @__PURE__ */ React.createElement("script", _extends({}, scriptProps, {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: serializeError(routeId, dataKey, error)
    }
  }));
}
function dedupe(array) {
  return [...new Set(array)];
}
function useMatches2() {
  return useMatches();
}
function useLoaderData2() {
  return useLoaderData();
}
function useRouteLoaderData2(routeId) {
  return useRouteLoaderData(routeId);
}
function useActionData2() {
  return useActionData();
}
function useFetcher2(opts = {}) {
  return useFetcher(opts);
}
var LiveReload = (
  // Dead Code Elimination magic for production builds.
  // This way devs don't have to worry about doing the NODE_ENV check themselves.
  false ? () => null : function LiveReload2({
    origin = "http://localhost:3001/",
    port,
    timeoutMs = 1e3,
    nonce = void 0
  }) {
    let js = String.raw;
    return /* @__PURE__ */ React.createElement("script", {
      nonce,
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: js`
                function remixLiveReloadConnect(config) {
                  let LIVE_RELOAD_ORIGIN = ${JSON.stringify(origin)};
                  let protocol =
                    LIVE_RELOAD_ORIGIN ? new URL(LIVE_RELOAD_ORIGIN).protocol.replace(/^http/, "ws") :
                    location.protocol === "https:" ? "wss:" : "ws:"; // remove in v2?
                  let hostname = LIVE_RELOAD_ORIGIN ? new URL(LIVE_RELOAD_ORIGIN).hostname : location.hostname;
                  let url = new URL(protocol + "//" + hostname + "/socket");

                  url.port =
                    ${port} ||
                    (LIVE_RELOAD_ORIGIN ? new URL(LIVE_RELOAD_ORIGIN).port : 8002);

                  let ws = new WebSocket(url.href);
                  ws.onmessage = async (message) => {
                    let event = JSON.parse(message.data);
                    if (event.type === "LOG") {
                      console.log(event.message);
                    }
                    if (event.type === "RELOAD") {
                      console.log("💿 Reloading window ...");
                      window.location.reload();
                    }
                    if (event.type === "HMR") {
                      if (!window.__hmr__ || !window.__hmr__.contexts) {
                        console.log("💿 [HMR] No HMR context, reloading window ...");
                        window.location.reload();
                        return;
                      }
                      if (!event.updates || !event.updates.length) return;
                      let updateAccepted = false;
                      let needsRevalidation = new Set();
                      for (let update of event.updates) {
                        console.log("[HMR] " + update.reason + " [" + update.id +"]")
                        if (update.revalidate) {
                          needsRevalidation.add(update.routeId);
                          console.log("[HMR] Revalidating [" + update.routeId + "]");
                        }
                        let imported = await import(update.url +  '?t=' + event.assetsManifest.hmr.timestamp);
                        if (window.__hmr__.contexts[update.id]) {
                          let accepted = window.__hmr__.contexts[update.id].emit(
                            imported
                          );
                          if (accepted) {
                            console.log("[HMR] Update accepted by", update.id);
                            updateAccepted = true;
                          }
                        }
                      }
                      if (event.assetsManifest && window.__hmr__.contexts["remix:manifest"]) {
                        let accepted = window.__hmr__.contexts["remix:manifest"].emit(
                          { needsRevalidation, assetsManifest: event.assetsManifest }
                        );
                        if (accepted) {
                          console.log("[HMR] Update accepted by", "remix:manifest");
                          updateAccepted = true;
                        }
                      }
                      if (!updateAccepted) {
                        console.log("[HMR] Update rejected, reloading...");
                        window.location.reload();
                      }
                    }
                  };
                  ws.onopen = () => {
                    if (config && typeof config.onOpen === "function") {
                      config.onOpen();
                    }
                  };
                  ws.onclose = (event) => {
                    if (event.code === 1006) {
                      console.log("Remix dev asset server web socket closed. Reconnecting...");
                      setTimeout(
                        () =>
                          remixLiveReloadConnect({
                            onOpen: () => window.location.reload(),
                          }),
                      ${String(timeoutMs)}
                      );
                    }
                  };
                  ws.onerror = (error) => {
                    console.log("Remix dev asset server web socket error:");
                    console.error(error);
                  };
                }
                remixLiveReloadConnect();
              `
      }
    });
  }
);
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

// node_modules/@remix-run/react/dist/esm/errorBoundaries.js
var React2 = __toESM(require_react());
init_dist2();
var RemixErrorBoundary = class extends React2.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error || null,
      location: props.location
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location) {
      return {
        error: props.error || null,
        location: props.location
      };
    }
    return {
      error: props.error || state.error,
      location: state.location
    };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React2.createElement(RemixRootDefaultErrorBoundary, {
        error: this.state.error
      });
    } else {
      return this.props.children;
    }
  }
};
function RemixRootDefaultErrorBoundary({
  error
}) {
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ React2.createElement(BoundaryShell, {
      title: "Unhandled Thrown Response!"
    }, /* @__PURE__ */ React2.createElement("h1", {
      style: {
        fontFamily: "system-ui, sans-serif",
        padding: "2rem"
      }
    }, error.status, " ", error.statusText));
  }
  let errorInstance;
  if (error instanceof Error) {
    errorInstance = error;
  } else {
    let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
    errorInstance = new Error(errorString);
  }
  return /* @__PURE__ */ React2.createElement(BoundaryShell, {
    title: "Application Error!"
  }, /* @__PURE__ */ React2.createElement("main", {
    style: {
      fontFamily: "system-ui, sans-serif",
      padding: "2rem"
    }
  }, /* @__PURE__ */ React2.createElement("h1", {
    style: {
      fontSize: "24px"
    }
  }, "Application Error"), /* @__PURE__ */ React2.createElement("pre", {
    style: {
      padding: "2rem",
      background: "hsla(10, 50%, 50%, 0.1)",
      color: "red",
      overflow: "auto"
    }
  }, errorInstance.stack)));
}
function BoundaryShell({
  title,
  children
}) {
  return /* @__PURE__ */ React2.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React2.createElement("head", null, /* @__PURE__ */ React2.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React2.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  }), /* @__PURE__ */ React2.createElement("title", null, title)), /* @__PURE__ */ React2.createElement("body", null, children, /* @__PURE__ */ React2.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
              );
            `
    }
  })));
}

// node_modules/@remix-run/react/dist/esm/errors.js
init_router();
function deserializeErrors(errors) {
  if (!errors)
    return null;
  let entries = Object.entries(errors);
  let serialized = {};
  for (let [key, val] of entries) {
    if (val && val.__type === "RouteErrorResponse") {
      serialized[key] = new ErrorResponseImpl(val.status, val.statusText, val.data, val.internal === true);
    } else if (val && val.__type === "Error") {
      if (val.__subType) {
        let ErrorConstructor = window[val.__subType];
        if (typeof ErrorConstructor === "function") {
          try {
            let error = new ErrorConstructor(val.message);
            error.stack = val.stack;
            serialized[key] = error;
          } catch (e) {
          }
        }
      }
      if (serialized[key] == null) {
        let error = new Error(val.message);
        error.stack = val.stack;
        serialized[key] = error;
      }
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}

// node_modules/@remix-run/react/dist/esm/routes.js
var React4 = __toESM(require_react());
init_router();
init_dist2();

// node_modules/@remix-run/react/dist/esm/data.js
init_router();
function isCatchResponse(response) {
  return response.headers.get("X-Remix-Catch") != null;
}
function isErrorResponse(response) {
  return response.headers.get("X-Remix-Error") != null;
}
function isNetworkErrorResponse(response) {
  return isResponse(response) && response.status >= 400 && response.headers.get("X-Remix-Error") == null && response.headers.get("X-Remix-Catch") == null && response.headers.get("X-Remix-Response") == null;
}
function isRedirectResponse(response) {
  return response.headers.get("X-Remix-Redirect") != null;
}
function isDeferredResponse(response) {
  var _response$headers$get;
  return !!((_response$headers$get = response.headers.get("Content-Type")) !== null && _response$headers$get !== void 0 && _response$headers$get.match(/text\/remix-deferred/));
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
async function fetchData(request, routeId, retry = 0) {
  let url = new URL(request.url);
  url.searchParams.set("_data", routeId);
  let init = {
    signal: request.signal
  };
  if (request.method !== "GET") {
    init.method = request.method;
    let contentType = request.headers.get("Content-Type");
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      init.headers = {
        "Content-Type": contentType
      };
      init.body = JSON.stringify(await request.json());
    } else if (contentType && /\btext\/plain\b/.test(contentType)) {
      init.headers = {
        "Content-Type": contentType
      };
      init.body = await request.text();
    } else if (contentType && /\bapplication\/x-www-form-urlencoded\b/.test(contentType)) {
      init.body = new URLSearchParams(await request.text());
    } else {
      init.body = await request.formData();
    }
  }
  if (retry > 0) {
    await new Promise((resolve) => setTimeout(resolve, 5 ** retry * 10));
  }
  let revalidation = window.__remixRevalidation;
  let response = await fetch(url.href, init).catch((error) => {
    if (typeof revalidation === "number" && revalidation === window.__remixRevalidation && (error === null || error === void 0 ? void 0 : error.name) === "TypeError" && retry < 3) {
      return fetchData(request, routeId, retry + 1);
    }
    throw error;
  });
  if (isErrorResponse(response)) {
    let data = await response.json();
    let error = new Error(data.message);
    error.stack = data.stack;
    return error;
  }
  if (isNetworkErrorResponse(response)) {
    let text = await response.text();
    let error = new Error(text);
    error.stack = void 0;
    return error;
  }
  return response;
}
var DEFERRED_VALUE_PLACEHOLDER_PREFIX = "__deferred_promise:";
async function parseDeferredReadableStream(stream) {
  if (!stream) {
    throw new Error("parseDeferredReadableStream requires stream argument");
  }
  let deferredData;
  let deferredResolvers = {};
  try {
    let sectionReader = readStreamSections(stream);
    let initialSectionResult = await sectionReader.next();
    let initialSection = initialSectionResult.value;
    if (!initialSection)
      throw new Error("no critical data");
    let criticalData = JSON.parse(initialSection);
    if (typeof criticalData === "object" && criticalData !== null) {
      for (let [eventKey, value] of Object.entries(criticalData)) {
        if (typeof value !== "string" || !value.startsWith(DEFERRED_VALUE_PLACEHOLDER_PREFIX)) {
          continue;
        }
        deferredData = deferredData || {};
        deferredData[eventKey] = new Promise((resolve, reject) => {
          deferredResolvers[eventKey] = {
            resolve: (value2) => {
              resolve(value2);
              delete deferredResolvers[eventKey];
            },
            reject: (error) => {
              reject(error);
              delete deferredResolvers[eventKey];
            }
          };
        });
      }
    }
    void (async () => {
      try {
        for await (let section of sectionReader) {
          let [event, ...sectionDataStrings] = section.split(":");
          let sectionDataString = sectionDataStrings.join(":");
          let data = JSON.parse(sectionDataString);
          if (event === "data") {
            for (let [key, value] of Object.entries(data)) {
              if (deferredResolvers[key]) {
                deferredResolvers[key].resolve(value);
              }
            }
          } else if (event === "error") {
            for (let [key, value] of Object.entries(data)) {
              let err = new Error(value.message);
              err.stack = value.stack;
              if (deferredResolvers[key]) {
                deferredResolvers[key].reject(err);
              }
            }
          }
        }
        for (let [key, resolver] of Object.entries(deferredResolvers)) {
          resolver.reject(new AbortedDeferredError(`Deferred ${key} will never be resolved`));
        }
      } catch (error) {
        for (let resolver of Object.values(deferredResolvers)) {
          resolver.reject(error);
        }
      }
    })();
    return new DeferredData({
      ...criticalData,
      ...deferredData
    });
  } catch (error) {
    for (let resolver of Object.values(deferredResolvers)) {
      resolver.reject(error);
    }
    throw error;
  }
}
async function* readStreamSections(stream) {
  let reader = stream.getReader();
  let buffer = [];
  let sections = [];
  let closed = false;
  let encoder = new TextEncoder();
  let decoder = new TextDecoder();
  let readStreamSection = async () => {
    if (sections.length > 0)
      return sections.shift();
    while (!closed && sections.length === 0) {
      let chunk = await reader.read();
      if (chunk.done) {
        closed = true;
        break;
      }
      buffer.push(chunk.value);
      try {
        let bufferedString = decoder.decode(mergeArrays(...buffer));
        let splitSections = bufferedString.split("\n\n");
        if (splitSections.length >= 2) {
          sections.push(...splitSections.slice(0, -1));
          buffer = [encoder.encode(splitSections.slice(-1).join("\n\n"))];
        }
        if (sections.length > 0) {
          break;
        }
      } catch {
        continue;
      }
    }
    if (sections.length > 0) {
      return sections.shift();
    }
    if (buffer.length > 0) {
      let bufferedString = decoder.decode(mergeArrays(...buffer));
      sections = bufferedString.split("\n\n").filter((s) => s);
      buffer = [];
    }
    return sections.shift();
  };
  let section = await readStreamSection();
  while (section) {
    yield section;
    section = await readStreamSection();
  }
}
function mergeArrays(...arrays) {
  let out = new Uint8Array(arrays.reduce((total, arr) => total + arr.length, 0));
  let offset = 0;
  for (let arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}

// node_modules/@remix-run/react/dist/esm/fallback.js
var React3 = __toESM(require_react());
function RemixRootDefaultHydrateFallback() {
  return /* @__PURE__ */ React3.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React3.createElement("head", null, /* @__PURE__ */ React3.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React3.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1,viewport-fit=cover"
  })), /* @__PURE__ */ React3.createElement("body", null, /* @__PURE__ */ React3.createElement(Scripts, null), /* @__PURE__ */ React3.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              console.log(
                "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this " +
                "when your app is running \`clientLoader\` functions on hydration. " +
                "Check out https://remix.run/route/hydrate-fallback for more information."
              );
            `
    }
  }), " "));
}

// node_modules/@remix-run/react/dist/esm/routes.js
function groupRoutesByParentId(manifest) {
  let routes = {};
  Object.values(manifest).forEach((route) => {
    let parentId = route.parentId || "";
    if (!routes[parentId]) {
      routes[parentId] = [];
    }
    routes[parentId].push(route);
  });
  return routes;
}
function createServerRoutes(manifest, routeModules, future, parentId = "", routesByParentId = groupRoutesByParentId(manifest)) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModules[route.id];
    let dataRoute = {
      caseSensitive: route.caseSensitive,
      Component: getRouteModuleComponent(routeModule),
      HydrateFallback: routeModule.HydrateFallback ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0,
      ErrorBoundary: routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ React4.createElement(RemixRootDefaultErrorBoundary, {
        error: useRouteError()
      }) : void 0,
      id: route.id,
      index: route.index,
      path: route.path,
      handle: routeModules[route.id].handle,
      // For partial hydration rendering, we need to indicate when the route
      // has a loader/clientLoader, but it won't ever be called during the static
      // render, so just give it a no-op function so we can render down to the
      // proper fallback
      loader: route.hasLoader || route.hasClientLoader ? () => null : void 0
      // We don't need action/shouldRevalidate on these routes since they're
      // for a static render
    };
    let children = createServerRoutes(manifest, routeModules, future, route.id, routesByParentId);
    if (children.length > 0)
      dataRoute.children = children;
    return dataRoute;
  });
}
function createClientRoutesWithHMRRevalidationOptOut(needsRevalidation, manifest, routeModulesCache, initialState, future) {
  return createClientRoutes(manifest, routeModulesCache, initialState, future, "", groupRoutesByParentId(manifest), needsRevalidation);
}
function getNoServerHandlerError(type, routeId) {
  let fn = type === "action" ? "serverAction()" : "serverLoader()";
  let msg = `You are trying to call ${fn} on a route that does not have a server ${type} (routeId: "${routeId}")`;
  console.error(msg);
  throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
}
function createClientRoutes(manifest, routeModulesCache, initialState, future, parentId = "", routesByParentId = groupRoutesByParentId(manifest), needsRevalidation) {
  return (routesByParentId[parentId] || []).map((route) => {
    let routeModule = routeModulesCache[route.id];
    async function fetchServerLoader(request) {
      if (!route.hasLoader)
        return null;
      return fetchServerHandler(request, route);
    }
    async function fetchServerAction(request) {
      if (!route.hasAction) {
        let msg = `Route "${route.id}" does not have an action, but you are trying to submit to it. To fix this, please add an \`action\` function to the route`;
        console.error(msg);
        throw new ErrorResponseImpl(405, "Method Not Allowed", new Error(msg), true);
      }
      return fetchServerHandler(request, route);
    }
    async function prefetchStylesAndCallHandler(handler) {
      let linkPrefetchPromise = routeModulesCache[route.id] ? prefetchStyleLinks(route, routeModulesCache[route.id]) : Promise.resolve();
      try {
        return handler();
      } finally {
        await linkPrefetchPromise;
      }
    }
    let dataRoute = {
      id: route.id,
      index: route.index,
      path: route.path
    };
    if (routeModule) {
      var _initialState$loaderD, _initialState$errors, _routeModule$clientLo;
      Object.assign(dataRoute, {
        ...dataRoute,
        Component: getRouteModuleComponent(routeModule),
        HydrateFallback: routeModule.HydrateFallback ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0,
        ErrorBoundary: routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ React4.createElement(RemixRootDefaultErrorBoundary, {
          error: useRouteError()
        }) : void 0,
        handle: routeModule.handle,
        shouldRevalidate: needsRevalidation ? wrapShouldRevalidateForHdr(route.id, routeModule.shouldRevalidate, needsRevalidation) : routeModule.shouldRevalidate
      });
      let initialData = initialState === null || initialState === void 0 ? void 0 : (_initialState$loaderD = initialState.loaderData) === null || _initialState$loaderD === void 0 ? void 0 : _initialState$loaderD[route.id];
      let initialError = initialState === null || initialState === void 0 ? void 0 : (_initialState$errors = initialState.errors) === null || _initialState$errors === void 0 ? void 0 : _initialState$errors[route.id];
      let isHydrationRequest = needsRevalidation == null && (((_routeModule$clientLo = routeModule.clientLoader) === null || _routeModule$clientLo === void 0 ? void 0 : _routeModule$clientLo.hydrate) === true || !route.hasLoader);
      dataRoute.loader = async ({
        request,
        params
      }) => {
        try {
          let result = await prefetchStylesAndCallHandler(async () => {
            if (!routeModule.clientLoader) {
              return fetchServerLoader(request);
            }
            return routeModule.clientLoader({
              request,
              params,
              async serverLoader() {
                if (!route.hasLoader) {
                  throw getNoServerHandlerError("loader", route.id);
                }
                if (isHydrationRequest) {
                  if (initialError !== void 0) {
                    throw initialError;
                  }
                  return initialData;
                }
                let result2 = await fetchServerLoader(request);
                let unwrapped = await unwrapServerResponse(result2);
                return unwrapped;
              }
            });
          });
          return result;
        } finally {
          isHydrationRequest = false;
        }
      };
      dataRoute.loader.hydrate = shouldHydrateRouteLoader(route, routeModule);
      dataRoute.action = ({
        request,
        params
      }) => {
        return prefetchStylesAndCallHandler(async () => {
          if (!routeModule.clientAction) {
            return fetchServerAction(request);
          }
          return routeModule.clientAction({
            request,
            params,
            async serverAction() {
              if (!route.hasAction) {
                throw getNoServerHandlerError("action", route.id);
              }
              let result = await fetchServerAction(request);
              let unwrapped = await unwrapServerResponse(result);
              return unwrapped;
            }
          });
        });
      };
    } else {
      if (!route.hasClientLoader) {
        dataRoute.loader = ({
          request
        }) => prefetchStylesAndCallHandler(() => fetchServerLoader(request));
      }
      if (!route.hasClientAction) {
        dataRoute.action = ({
          request
        }) => prefetchStylesAndCallHandler(() => fetchServerAction(request));
      }
      dataRoute.lazy = async () => {
        let mod = await loadRouteModuleWithBlockingLinks(route, routeModulesCache);
        let lazyRoute = {
          ...mod
        };
        if (mod.clientLoader) {
          let clientLoader = mod.clientLoader;
          lazyRoute.loader = (args) => clientLoader({
            ...args,
            async serverLoader() {
              if (!route.hasLoader) {
                throw getNoServerHandlerError("loader", route.id);
              }
              let response = await fetchServerLoader(args.request);
              let result = await unwrapServerResponse(response);
              return result;
            }
          });
        }
        if (mod.clientAction) {
          let clientAction = mod.clientAction;
          lazyRoute.action = (args) => clientAction({
            ...args,
            async serverAction() {
              if (!route.hasAction) {
                throw getNoServerHandlerError("action", route.id);
              }
              let response = await fetchServerAction(args.request);
              let result = await unwrapServerResponse(response);
              return result;
            }
          });
        }
        if (needsRevalidation) {
          lazyRoute.shouldRevalidate = wrapShouldRevalidateForHdr(route.id, mod.shouldRevalidate, needsRevalidation);
        }
        return {
          ...lazyRoute.loader ? {
            loader: lazyRoute.loader
          } : {},
          ...lazyRoute.action ? {
            action: lazyRoute.action
          } : {},
          hasErrorBoundary: lazyRoute.hasErrorBoundary,
          shouldRevalidate: lazyRoute.shouldRevalidate,
          handle: lazyRoute.handle,
          Component: lazyRoute.Component,
          ErrorBoundary: lazyRoute.ErrorBoundary
        };
      };
    }
    let children = createClientRoutes(manifest, routeModulesCache, initialState, future, route.id, routesByParentId, needsRevalidation);
    if (children.length > 0)
      dataRoute.children = children;
    return dataRoute;
  });
}
function wrapShouldRevalidateForHdr(routeId, routeShouldRevalidate, needsRevalidation) {
  let handledRevalidation = false;
  return (arg) => {
    if (!handledRevalidation) {
      handledRevalidation = true;
      return needsRevalidation.has(routeId);
    }
    return routeShouldRevalidate ? routeShouldRevalidate(arg) : arg.defaultShouldRevalidate;
  };
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
  let routeModule = await loadRouteModule(route, routeModules);
  await prefetchStyleLinks(route, routeModule);
  return {
    Component: getRouteModuleComponent(routeModule),
    ErrorBoundary: routeModule.ErrorBoundary,
    clientAction: routeModule.clientAction,
    clientLoader: routeModule.clientLoader,
    handle: routeModule.handle,
    links: routeModule.links,
    meta: routeModule.meta,
    shouldRevalidate: routeModule.shouldRevalidate
  };
}
async function fetchServerHandler(request, route) {
  let result = await fetchData(request, route.id);
  if (result instanceof Error) {
    throw result;
  }
  if (isRedirectResponse(result)) {
    throw getRedirect(result);
  }
  if (isCatchResponse(result)) {
    throw result;
  }
  if (isDeferredResponse(result) && result.body) {
    return await parseDeferredReadableStream(result.body);
  }
  return result;
}
function unwrapServerResponse(result) {
  if (isDeferredData(result)) {
    return result.data;
  }
  if (isResponse(result)) {
    let contentType = result.headers.get("Content-Type");
    if (contentType && /\bapplication\/json\b/.test(contentType)) {
      return result.json();
    } else {
      return result.text();
    }
  }
  return result;
}
function getRedirect(response) {
  let status = parseInt(response.headers.get("X-Remix-Status"), 10) || 302;
  let url = response.headers.get("X-Remix-Redirect");
  let headers = {};
  let revalidate = response.headers.get("X-Remix-Revalidate");
  if (revalidate) {
    headers["X-Remix-Revalidate"] = revalidate;
  }
  let reloadDocument = response.headers.get("X-Remix-Reload-Document");
  if (reloadDocument) {
    headers["X-Remix-Reload-Document"] = reloadDocument;
  }
  return redirect(url, {
    status,
    headers
  });
}
function getRouteModuleComponent(routeModule) {
  if (routeModule.default == null)
    return void 0;
  let isEmptyObject = typeof routeModule.default === "object" && Object.keys(routeModule.default).length === 0;
  if (!isEmptyObject) {
    return routeModule.default;
  }
}
function shouldHydrateRouteLoader(route, routeModule) {
  return routeModule.clientLoader != null && (routeModule.clientLoader.hydrate === true || route.hasLoader !== true);
}

// node_modules/@remix-run/react/dist/esm/browser.js
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"node_modules/@remix-run/react/dist/esm/browser.js"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "node_modules/@remix-run/react/dist/esm/browser.js"
  );
}
var router;
var routerInitialized = false;
var hmrAbortController;
var hmrRouterReadyResolve;
var hmrRouterReadyPromise = new Promise((resolve) => {
  hmrRouterReadyResolve = resolve;
}).catch(() => {
  return void 0;
});
var criticalCssReducer = () => void 0;
if (import.meta && import.meta.hot) {
  import.meta.hot.accept("remix:manifest", async ({
    assetsManifest,
    needsRevalidation
  }) => {
    let router2 = await hmrRouterReadyPromise;
    if (!router2) {
      console.error("Failed to accept HMR update because the router was not ready.");
      return;
    }
    let routeIds = [...new Set(router2.state.matches.map((m) => m.route.id).concat(Object.keys(window.__remixRouteModules)))];
    if (hmrAbortController) {
      hmrAbortController.abort();
    }
    hmrAbortController = new AbortController();
    let signal = hmrAbortController.signal;
    let newRouteModules = Object.assign({}, window.__remixRouteModules, Object.fromEntries((await Promise.all(routeIds.map(async (id) => {
      var _assetsManifest$hmr, _window$__remixRouteM, _window$__remixRouteM2, _window$__remixRouteM3;
      if (!assetsManifest.routes[id]) {
        return null;
      }
      let imported = await import(assetsManifest.routes[id].module + `?t=${(_assetsManifest$hmr = assetsManifest.hmr) === null || _assetsManifest$hmr === void 0 ? void 0 : _assetsManifest$hmr.timestamp}`);
      return [id, {
        ...imported,
        // react-refresh takes care of updating these in-place,
        // if we don't preserve existing values we'll loose state.
        default: imported.default ? ((_window$__remixRouteM = window.__remixRouteModules[id]) === null || _window$__remixRouteM === void 0 ? void 0 : _window$__remixRouteM.default) ?? imported.default : imported.default,
        ErrorBoundary: imported.ErrorBoundary ? ((_window$__remixRouteM2 = window.__remixRouteModules[id]) === null || _window$__remixRouteM2 === void 0 ? void 0 : _window$__remixRouteM2.ErrorBoundary) ?? imported.ErrorBoundary : imported.ErrorBoundary,
        HydrateFallback: imported.HydrateFallback ? ((_window$__remixRouteM3 = window.__remixRouteModules[id]) === null || _window$__remixRouteM3 === void 0 ? void 0 : _window$__remixRouteM3.HydrateFallback) ?? imported.HydrateFallback : imported.HydrateFallback
      }];
    }))).filter(Boolean)));
    Object.assign(window.__remixRouteModules, newRouteModules);
    let routes = createClientRoutesWithHMRRevalidationOptOut(needsRevalidation, assetsManifest.routes, window.__remixRouteModules, window.__remixContext.state, window.__remixContext.future);
    router2._internalSetRoutes(routes);
    let unsub = router2.subscribe((state) => {
      if (state.revalidation === "idle") {
        unsub();
        if (signal.aborted)
          return;
        setTimeout(() => {
          Object.assign(window.__remixManifest, assetsManifest);
          window.$RefreshRuntime$.performReactRefresh();
        }, 1);
      }
    });
    window.__remixRevalidation = (window.__remixRevalidation || 0) + 1;
    router2.revalidate();
  });
}
function RemixBrowser(_props) {
  _s();
  if (!router) {
    let initialPathname = window.__remixContext.url;
    let hydratedPathname = window.location.pathname;
    if (initialPathname !== hydratedPathname) {
      let errorMsg = `Initial URL (${initialPathname}) does not match URL at time of hydration (${hydratedPathname}), reloading page...`;
      console.error(errorMsg);
      window.location.reload();
      return /* @__PURE__ */ React5.createElement(React5.Fragment, null);
    }
    let routes = createClientRoutes(window.__remixManifest.routes, window.__remixRouteModules, window.__remixContext.state, window.__remixContext.future);
    let hydrationData = {
      ...window.__remixContext.state,
      loaderData: {
        ...window.__remixContext.state.loaderData
      }
    };
    let initialMatches = matchRoutes(routes, window.location);
    if (initialMatches) {
      for (let match of initialMatches) {
        let routeId = match.route.id;
        let route = window.__remixRouteModules[routeId];
        let manifestRoute = window.__remixManifest.routes[routeId];
        if (route && shouldHydrateRouteLoader(manifestRoute, route) && (route.HydrateFallback || !manifestRoute.hasLoader)) {
          hydrationData.loaderData[routeId] = void 0;
        } else if (manifestRoute && !manifestRoute.hasLoader) {
          hydrationData.loaderData[routeId] = null;
        }
      }
    }
    if (hydrationData && hydrationData.errors) {
      hydrationData.errors = deserializeErrors(hydrationData.errors);
    }
    router = createRouter({
      routes,
      history: createBrowserHistory(),
      future: {
        v7_normalizeFormMethod: true,
        v7_fetcherPersist: window.__remixContext.future.v3_fetcherPersist,
        v7_partialHydration: true,
        v7_prependBasename: true,
        v7_relativeSplatPath: window.__remixContext.future.v3_relativeSplatPath
      },
      hydrationData,
      mapRouteProperties
    });
    if (router.state.initialized) {
      routerInitialized = true;
      router.initialize();
    }
    router.createRoutesForHMR = createClientRoutesWithHMRRevalidationOptOut;
    window.__remixRouter = router;
    if (hmrRouterReadyResolve) {
      hmrRouterReadyResolve(router);
    }
  }
  let [criticalCss, clearCriticalCss] = React5.useReducer(criticalCssReducer, window.__remixContext.criticalCss);
  window.__remixClearCriticalCss = clearCriticalCss;
  let [location, setLocation] = React5.useState(router.state.location);
  React5.useLayoutEffect(() => {
    if (!routerInitialized) {
      routerInitialized = true;
      router.initialize();
    }
  }, []);
  React5.useLayoutEffect(() => {
    return router.subscribe((newState) => {
      if (newState.location !== location) {
        setLocation(newState.location);
      }
    });
  }, [location]);
  return /* @__PURE__ */ React5.createElement(RemixContext.Provider, {
    value: {
      manifest: window.__remixManifest,
      routeModules: window.__remixRouteModules,
      future: window.__remixContext.future,
      criticalCss
    }
  }, /* @__PURE__ */ React5.createElement(RemixErrorBoundary, {
    location
  }, /* @__PURE__ */ React5.createElement(RouterProvider, {
    router,
    fallbackElement: null,
    future: {
      v7_startTransition: true
    }
  })));
}
_s(RemixBrowser, "dNY/ZcXj2W8K0mGOaHLSDzAVXYE=");
_c = RemixBrowser;
var _c;
$RefreshReg$(_c, "RemixBrowser");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// node_modules/@remix-run/react/dist/esm/scroll-restoration.js
var React6 = __toESM(require_react());
init_dist2();
var STORAGE_KEY = "positions";
function ScrollRestoration({
  getKey,
  ...props
}) {
  let location = useLocation();
  let matches = useMatches();
  useScrollRestoration({
    getKey,
    storageKey: STORAGE_KEY
  });
  let key = React6.useMemo(
    () => {
      if (!getKey)
        return null;
      let userKey = getKey(location, matches);
      return userKey !== location.key ? userKey : null;
    },
    // Nah, we only need this the first time for the SSR render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  let restoreScroll = ((STORAGE_KEY2, restoreKey) => {
    if (!window.history.state || !window.history.state.key) {
      let key2 = Math.random().toString(32).slice(2);
      window.history.replaceState({
        key: key2
      }, "");
    }
    try {
      let positions = JSON.parse(sessionStorage.getItem(STORAGE_KEY2) || "{}");
      let storedY = positions[restoreKey || window.history.state.key];
      if (typeof storedY === "number") {
        window.scrollTo(0, storedY);
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem(STORAGE_KEY2);
    }
  }).toString();
  return /* @__PURE__ */ React6.createElement("script", _extends({}, props, {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: `(${restoreScroll})(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(key)})`
    }
  }));
}

// node_modules/@remix-run/react/dist/esm/server.js
var React7 = __toESM(require_react());
var import_server = __toESM(require_server());
function RemixServer({
  context,
  url,
  abortDelay
}) {
  if (typeof url === "string") {
    url = new URL(url);
  }
  let {
    manifest,
    routeModules,
    criticalCss,
    serverHandoffString
  } = context;
  let routes = createServerRoutes(manifest.routes, routeModules, context.future);
  context.staticHandlerContext.loaderData = {
    ...context.staticHandlerContext.loaderData
  };
  for (let match of context.staticHandlerContext.matches) {
    let routeId = match.route.id;
    let route = routeModules[routeId];
    let manifestRoute = context.manifest.routes[routeId];
    if (route && shouldHydrateRouteLoader(manifestRoute, route) && (route.HydrateFallback || !manifestRoute.hasLoader)) {
      context.staticHandlerContext.loaderData[routeId] = void 0;
    }
  }
  let router2 = (0, import_server.createStaticRouter)(routes, context.staticHandlerContext, {
    future: {
      v7_partialHydration: true,
      v7_relativeSplatPath: context.future.v3_relativeSplatPath
    }
  });
  return /* @__PURE__ */ React7.createElement(RemixContext.Provider, {
    value: {
      manifest,
      routeModules,
      criticalCss,
      serverHandoffString,
      future: context.future,
      serializeError: context.serializeError,
      abortDelay
    }
  }, /* @__PURE__ */ React7.createElement(RemixErrorBoundary, {
    location: router2.state.location
  }, /* @__PURE__ */ React7.createElement(import_server.StaticRouterProvider, {
    router: router2,
    context: context.staticHandlerContext,
    hydrate: false
  })));
}

export {
  json2 as json,
  defer2 as defer,
  redirect2 as redirect,
  redirectDocument2 as redirectDocument,
  RemixContext,
  NavLink2 as NavLink,
  Link2 as Link,
  Links,
  PrefetchPageLinks,
  Meta,
  Await2 as Await,
  Scripts,
  useMatches2 as useMatches,
  useLoaderData2 as useLoaderData,
  useRouteLoaderData2 as useRouteLoaderData,
  useActionData2 as useActionData,
  useFetcher2 as useFetcher,
  LiveReload,
  RemixBrowser,
  ScrollRestoration,
  RemixServer
};
/*! Bundled license information:

@remix-run/server-runtime/dist/esm/responses.js:
  (**
   * @remix-run/server-runtime v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/esm/index.js:
  (**
   * @remix-run/server-runtime v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/_virtual/_rollupPluginBabelHelpers.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/invariant.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/routeModules.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/links.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/markup.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/components.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/errorBoundaries.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/errors.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/data.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/fallback.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/routes.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/browser.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/scroll-restoration.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/server.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/index.js:
  (**
   * @remix-run/react v2.4.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
//# sourceMappingURL=/build/_shared/chunk-FSHJZDJN.js.map
