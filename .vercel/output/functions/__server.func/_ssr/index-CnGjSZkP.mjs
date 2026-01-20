import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/@tanstack/react-router.mjs";
import { C as Clapperboard, G as Github, A as ArrowRight, P as Plus, F as Film, d as Star, i as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/tiny-warning.mjs";
import "../_libs/@tanstack/router-core.mjs";
import "../_libs/@tanstack/store.mjs";
import "../_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
function Spotlight({ className = "", fill = "white" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className: `animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 ${className}`,
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 3787 2842",
      fill: "none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: "url(#filter)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "1924.71",
            cy: "273.501",
            rx: "1924.71",
            ry: "273.501",
            transform: "matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)",
            fill,
            fillOpacity: "0.21"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "filter",
          {
            id: "filter",
            x: "0.860352",
            y: "0.838989",
            width: "3785.16",
            height: "2840.26",
            filterUnits: "userSpaceOnUse",
            colorInterpolationFilters: "sRGB",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodOpacity: "0", result: "BackgroundImageFix" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "151", result: "effect1_foregroundBlur_1065_8" })
            ]
          }
        ) })
      ]
    }
  );
}
function LandingPage() {
  const [showSpotlight, setShowSpotlight] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setShowSpotlight(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const features = [{
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-6 h-6" }),
    title: "Track Your Movies",
    description: "Add movies from IMDB and keep track of your entire collection in one place."
  }, {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-6 h-6" }),
    title: "Ratings & Details",
    description: "View ratings, plot summaries, cast information, and more for every movie."
  }, {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6" }),
    title: "Beautiful Design",
    description: "Enjoy a modern, sleek interface that makes browsing your collection a pleasure."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-black overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Spotlight, { className: `fixed -top-40 left-[30%] z-30 spotlight-fade ${!showSpotlight ? "hidden" : ""}`, fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 px-6 h-14 flex items-center justify-between backdrop-blur-md bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] bg-black/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 20, className: "text-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "MovieRecs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative py-24 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white/5 border border-white/10 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { className: "w-10 h-10 text-white" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight", children: [
        "Movie",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "Recommendations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/50 mb-8 max-w-xl mx-auto", children: "Your personal movie collection, beautifully organized. Track movies and TV shows with detailed information and ratings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all", children: [
          "Get Started",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white font-medium transition-colors", children: "View Dashboard" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 px-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-white text-center mb-12", children: "Why use MovieRecs?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 bg-white/10 rounded-lg w-fit text-white", children: feature.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-white mb-2", children: feature.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50", children: feature.description })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 px-6 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-white text-center mb-12", children: "How it Works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row items-center justify-between gap-8", children: [{
        step: "1",
        title: "Search",
        desc: "Find any movie or TV show"
      }, {
        step: "2",
        title: "Select",
        desc: "Pick from the results"
      }, {
        step: "3",
        title: "Add",
        desc: "Save to your collection"
      }].map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 mx-auto mb-4 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-medium", children: item.step }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-white mb-1", children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40", children: item.desc })
      ] }, index)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white mb-3", children: "Ready to start?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mb-6 text-sm", children: "Build your personalized movie library today." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
        "Go to Dashboard"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "py-6 px-6 text-center text-white/30 text-sm border-t border-white/10", children: "MovieRecs — Your personal movie collection" })
  ] });
}
export {
  LandingPage as component
};
