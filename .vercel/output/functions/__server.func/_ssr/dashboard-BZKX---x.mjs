import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/@tanstack/react-router.mjs";
import { R as Route$1, a as addMovie, d as deleteMovie, s as searchMovies } from "./router-CdieW3_0.mjs";
import { C as Clapperboard, G as Github, F as Film, T as Tv, P as Plus, L as LoaderCircle, S as Search, a as Command, b as CircleCheckBig, X, c as CircleAlert, d as Star, e as Trash2, f as Clock, U as User, g as ChevronLeft, h as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "./index.mjs";
import "node:async_hooks";
function MovieCard({ movie, onDelete }) {
  const posterUrl = movie.poster || "/placeholder-movie.svg";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative h-[350px] bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[216px] flex-shrink-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: posterUrl,
          alt: movie.title,
          className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
          onError: (e) => {
            e.target.src = "/placeholder-movie.svg";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" }),
      movie.rating && movie.rating !== "N/A" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 10, fill: "currentColor" }),
        movie.rating
      ] }),
      onDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onDelete(movie.id),
          className: "absolute top-2 left-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity",
          title: "Remove",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white line-clamp-1", children: movie.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-white/60", children: [
          movie.year && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: movie.year }),
          movie.runtime && movie.runtime !== "N/A" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
            movie.runtime
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-2.5 flex flex-col overflow-hidden", children: [
      movie.genre && movie.genre !== "N/A" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-1.5", children: movie.genre.split(", ").slice(0, 3).map((genre) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded",
          children: genre
        },
        genre
      )) }),
      movie.plot && movie.plot !== "N/A" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/50 line-clamp-3 leading-relaxed flex-1", children: movie.plot }),
      movie.director && movie.director !== "N/A" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-white/40 pt-1.5 mt-auto border-t border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 10 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
          "Dir: ",
          movie.director
        ] })
      ] })
    ] })
  ] });
}
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];
function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  if (totalItems === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white/50", children: [
      "Showing ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/70 font-medium", children: [
        startItem,
        "-",
        endItem
      ] }),
      " of",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 font-medium", children: totalItems }),
      " items"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onPageChange(currentPage - 1),
          disabled: currentPage === 1,
          className: "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all\n            bg-white/5 border border-white/10 text-white/60\n            hover:bg-white/10 hover:text-white hover:border-white/20\n            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white/60 disabled:hover:border-white/10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 }),
            "Prev"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1.5 text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-lg", children: [
        "Page ",
        currentPage,
        " of ",
        totalPages
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onPageChange(currentPage + 1),
          disabled: currentPage === totalPages,
          className: "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all\n            bg-white/5 border border-white/10 text-white/60\n            hover:bg-white/10 hover:text-white hover:border-white/20\n            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white/60 disabled:hover:border-white/10",
          children: [
            "Next",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/50", children: "Show:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: ITEMS_PER_PAGE_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onItemsPerPageChange(option),
          className: `px-2.5 py-1 text-sm font-medium rounded-md transition-all ${itemsPerPage === option ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"}`,
          children: option
        },
        option
      )) })
    ] })
  ] });
}
function AddMovieForm({ onSubmit }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [query, setQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [isAdding, setIsAdding] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(false);
  const [selectedIndex, setSelectedIndex] = reactExports.useState(0);
  const modalRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleArrowNav = (e) => {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        handleSelectMovie(results[selectedIndex]);
      }
    };
    document.addEventListener("keydown", handleArrowNav);
    return () => document.removeEventListener("keydown", handleArrowNav);
  }, [isOpen, results, selectedIndex]);
  reactExports.useEffect(() => {
    setSelectedIndex(0);
  }, [results]);
  reactExports.useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) closeModal();
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  reactExports.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);
  reactExports.useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = debouncedQuery.trim();
      if (trimmedQuery.length <= 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      setError(null);
      try {
        const data = await searchMovies({ data: { query: debouncedQuery } });
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Search failed");
      } finally {
        setIsSearching(false);
      }
    };
    performSearch();
  }, [debouncedQuery]);
  const closeModal = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setError(null);
  };
  const handleSelectMovie = async (movie) => {
    setIsAdding(true);
    setError(null);
    try {
      await onSubmit(movie.imdbID);
      setSuccess(true);
      closeModal();
      setTimeout(() => setSuccess(false), 3e3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setIsAdding(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/60 hover:text-white transition-all text-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Search..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("kbd", { className: "hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/40 ml-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Command, { size: 10 }),
            "K"
          ] })
        ]
      }
    ),
    success && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 flex items-center gap-2 text-white text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 z-[60] backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
      "Added successfully!"
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[12vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: modalRef,
          className: "relative w-full max-w-xl mx-4 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-white/10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, className: "text-white/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: inputRef,
                  type: "text",
                  value: query,
                  onChange: (e) => setQuery(e.target.value),
                  placeholder: "Search movies & TV shows...",
                  disabled: isAdding,
                  className: "flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm",
                  autoComplete: "off"
                }
              ),
              isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "text-white animate-spin" }),
              query && !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQuery(""), className: "text-white/40 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[360px] overflow-y-auto", children: [
              isSearching && query.trim().length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-white/40 text-sm", children: "Searching..." }),
              !isSearching && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-2", children: results.map((movie, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleSelectMovie(movie),
                  onMouseEnter: () => setSelectedIndex(index),
                  className: `w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${selectedIndex === index ? "bg-white/10" : "hover:bg-white/5"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-14 bg-white/10 rounded overflow-hidden flex-shrink-0", children: movie.Poster !== "N/A" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: movie.Poster, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-white/30 text-xs", children: "N/A" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-sm font-medium truncate", children: movie.Title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-white/40 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: movie.Year }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] uppercase font-medium bg-white/10", children: movie.Type === "movie" ? "Movie" : "Series" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: `text-white transition-opacity ${selectedIndex === index ? "opacity-100" : "opacity-0"}` })
                  ]
                },
                movie.imdbID
              )) }),
              !isSearching && results.length === 0 && query.trim().length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-white/40 text-sm", children: "No results found" }),
              !isSearching && query.trim().length <= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-white/40 text-sm", children: "Type to search..." }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mb-4 p-3 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 16 }),
                error
              ] }),
              isAdding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mb-4 p-3 flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-lg text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
                "Adding..."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-white/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-white/10 rounded", children: "↑↓" }),
                  " Navigate"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-white/10 rounded", children: "↵" }),
                  " Add"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-white/10 rounded", children: "esc" }),
                " Close"
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Dashboard() {
  const router = useRouter();
  const movies = Route$1.useLoaderData();
  const [isDeleting, setIsDeleting] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("movie");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [itemsPerPage, setItemsPerPage] = reactExports.useState(10);
  const filteredMovies = reactExports.useMemo(() => movies.filter((movie) => activeTab === "movie" ? movie.type === "movie" : movie.type === "series"), [movies, activeTab]);
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const paginatedMovies = reactExports.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovies, currentPage, itemsPerPage]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  const handleAddMovie = async (imdbId) => {
    await addMovie({
      data: imdbId
    });
    router.invalidate();
  };
  const handleDeleteMovie = async (id) => {
    setIsDeleting(id);
    try {
      await deleteMovie({
        data: id
      });
      router.invalidate();
    } finally {
      setIsDeleting(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-black overflow-hidden flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 px-6 h-14 flex-shrink-0 flex items-center justify-between backdrop-blur-md bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] bg-black/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { size: 20, className: "text-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: "MovieRecs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "text-white/50 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { size: 18 }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 flex flex-col py-4 px-6 max-w-7xl mx-auto w-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleTabChange("movie"), className: `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "movie" ? "bg-white text-black" : "text-white/60 hover:text-white"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { size: 16 }),
            "Movies",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 text-xs rounded ${activeTab === "movie" ? "bg-black/10" : "bg-white/10"}`, children: movies.filter((m) => m.type === "movie").length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleTabChange("series"), className: `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "series" ? "bg-white text-black" : "text-white/60 hover:text-white"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tv, { size: 16 }),
            "TV Shows",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.5 text-xs rounded ${activeTab === "series" ? "bg-black/10" : "bg-white/10"}`, children: movies.filter((m) => m.type === "series").length })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddMovieForm, { onSubmit: handleAddMovie })
      ] }),
      filteredMovies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-40 h-40 mb-6 transition-transform hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: activeTab === "movie" ? "/empty-movies.svg" : "/empty-tvshows.svg", alt: `No ${activeTab === "movie" ? "movies" : "TV shows"}`, className: "w-full h-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-medium text-white mb-2", children: [
          "No ",
          activeTab === "movie" ? "movies" : "TV shows",
          " yet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 max-w-sm mb-6 text-sm", children: [
          "Search above to add ",
          activeTab === "movie" ? "movies" : "TV shows",
          " to your collection."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: (activeTab === "movie" ? [{
          id: "tt0111161",
          name: "Shawshank Redemption"
        }, {
          id: "tt0468569",
          name: "The Dark Knight"
        }, {
          id: "tt1375666",
          name: "Inception"
        }] : [{
          id: "tt0903747",
          name: "Breaking Bad"
        }, {
          id: "tt0944947",
          name: "Game of Thrones"
        }, {
          id: "tt4574334",
          name: "Stranger Things"
        }]).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleAddMovie(item.id), className: "group px-3 py-1.5 rounded-full text-sm transition-all bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "transition-transform group-hover:rotate-90" }),
          item.name
        ] }, item.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto pr-2 -mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: paginatedMovies.map((movie) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          isDeleting === movie.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MovieCard, { movie, onDelete: handleDeleteMovie })
        ] }, movie.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { currentPage, totalPages, totalItems: filteredMovies.length, itemsPerPage, onPageChange: setCurrentPage, onItemsPerPageChange: handleItemsPerPageChange }) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
