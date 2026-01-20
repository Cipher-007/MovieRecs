import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, L as Link, H as HeadContent, S as Scripts } from "../_libs/@tanstack/react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { C as Clapperboard, G as Github } from "../_libs/lucide-react.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/@tanstack/router-core.mjs";
import "../_libs/@tanstack/store.mjs";
import "../_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "../_libs/cross-fetch.mjs";
import "../_libs/node-fetch.mjs";
import "stream";
import "http";
import "url";
import "../_libs/whatwg-url.mjs";
import "../_libs/webidl-conversions.mjs";
import "punycode";
import "../_libs/tr46.mjs";
import "https";
import "zlib";
import "util";
import "crypto";
import "async_hooks";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "node:async_hooks";
const appCss = "/assets/styles-LhWA_RkF.css";
const Route$2 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Movie Recommendations - Your Personal Movie Collection"
      },
      {
        name: "description",
        content: "Track your favorite movies with IMDB integration. Beautiful, modern movie collection manager."
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        href: "/favicon.ico"
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function MovieCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[350px] bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[216px] flex-shrink-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full animate-skeleton" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 w-12 h-5 rounded animate-skeleton" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-3/4 rounded animate-skeleton mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 rounded animate-skeleton" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-2.5 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-14 rounded animate-skeleton" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-16 rounded animate-skeleton" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-12 rounded animate-skeleton" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded animate-skeleton" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded animate-skeleton" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-2/3 rounded animate-skeleton" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1.5 mt-auto border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 rounded animate-skeleton" }) })
    ] })
  ] });
}
const createSsrRpc = (functionId, importer) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getAllMovies = createServerFn({
  method: "GET"
}).handler(createSsrRpc("891d7f497f2e0be936590e6135bb43b6ca28d272f44867688274ebaf57ef20c2"));
const addMovie = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("e3c1850036d96bc4a6e53a51d894f9ddfbe310d8328b96730f8f75a6b5bb1557"));
const deleteMovie = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("a9aea98c5acbf05f88d8e86c86f6a0aee623f76574d61e94a84568012e5821a0"));
const searchMovies = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(createSsrRpc("5bf787eebf7ad420dd40cab10af59385eaffb5393bb452c91f194553fe19ffbb"));
const $$splitComponentImporter$1 = () => import("./dashboard-BZKX---x.mjs");
const Route$1 = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  loader: async () => await getAllMovies(),
  pendingComponent: DashboardSkeleton
});
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-black overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 px-6 h-14 flex items-center justify-between backdrop-blur-md bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] bg-black/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 20, className: "text-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "MovieRecs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { size: 18 }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-6 px-6 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-64 rounded-lg animate-skeleton" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-80 rounded-lg animate-skeleton" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: Array.from({
        length: 10
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(MovieCardSkeleton, {}, i)) })
    ] })
  ] });
}
const $$splitComponentImporter = () => import("./index-CnGjSZkP.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const DashboardRoute = Route$1.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$2
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  DashboardRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  addMovie as a,
  deleteMovie as d,
  router as r,
  searchMovies as s
};
