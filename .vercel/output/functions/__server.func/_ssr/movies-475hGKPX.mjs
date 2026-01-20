import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { a as createClient } from "../_libs/@libsql/client.mjs";
import { d as drizzle, s as sqliteTable, e as eq, i as integer, a as sql, t as text } from "../_libs/drizzle-orm.mjs";
import "node:async_hooks";
import "../_libs/react.mjs";
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
import "../_libs/@tanstack/react-router.mjs";
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
import "../_libs/@libsql/core.mjs";
import "../_libs/js-base64.mjs";
import "libsql";
import "node:buffer";
import "../_libs/@libsql/hrana-client.mjs";
import "../_libs/ws.mjs";
import "events";
import "net";
import "tls";
import "buffer";
import "../_libs/promise-limit.mjs";
const createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const movies = sqliteTable("movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imdbId: text("imdb_id").notNull().unique(),
  title: text("title").notNull(),
  year: text("year"),
  plot: text("plot"),
  poster: text("poster"),
  rating: text("rating"),
  genre: text("genre"),
  director: text("director"),
  actors: text("actors"),
  runtime: text("runtime"),
  type: text("type").notNull().default("movie"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`)
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  movies
}, Symbol.toStringTag, { value: "Module" }));
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const db = drizzle(client, { schema });
async function fetchMovieByImdbId(imdbId) {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    throw new Error("OMDB_API_KEY is not configured");
  }
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}&plot=short`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "False") {
      console.error("OMDB API Error:", data.Error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch movie from OMDB:", error);
    return null;
  }
}
async function searchMoviesByTitle(query, type) {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    throw new Error("OMDB_API_KEY is not configured");
  }
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }
  let url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(trimmedQuery)}`;
  if (type) {
    url += `&type=${type}`;
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "False") {
      return [];
    }
    return data.Search || [];
  } catch (error) {
    console.error("Failed to search movies from OMDB:", error);
    return [];
  }
}
const getAllMovies_createServerFn_handler = createServerRpc({
  id: "891d7f497f2e0be936590e6135bb43b6ca28d272f44867688274ebaf57ef20c2",
  name: "getAllMovies",
  filename: "src/server/movies.ts"
}, (opts, signal) => getAllMovies.__executeServer(opts, signal));
const getAllMovies = createServerFn({
  method: "GET"
}).handler(getAllMovies_createServerFn_handler, async () => {
  const allMovies = await db.select().from(movies).orderBy(movies.createdAt);
  return allMovies;
});
const addMovie_createServerFn_handler = createServerRpc({
  id: "e3c1850036d96bc4a6e53a51d894f9ddfbe310d8328b96730f8f75a6b5bb1557",
  name: "addMovie",
  filename: "src/server/movies.ts"
}, (opts, signal) => addMovie.__executeServer(opts, signal));
const addMovie = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(addMovie_createServerFn_handler, async ({
  data
}) => {
  const imdbId = data;
  if (!imdbId || !imdbId.startsWith("tt")) {
    throw new Error('Invalid IMDB ID. It should start with "tt"');
  }
  const existing = await db.select().from(movies).where(eq(movies.imdbId, imdbId)).limit(1);
  if (existing.length > 0) {
    throw new Error("Movie already exists in your collection");
  }
  const omdbMovie = await fetchMovieByImdbId(imdbId);
  if (!omdbMovie) {
    throw new Error("Movie not found. Please check the IMDB ID");
  }
  const newMovie = {
    imdbId: omdbMovie.imdbID,
    title: omdbMovie.Title,
    year: omdbMovie.Year,
    plot: omdbMovie.Plot,
    poster: omdbMovie.Poster !== "N/A" ? omdbMovie.Poster : null,
    rating: omdbMovie.imdbRating,
    genre: omdbMovie.Genre,
    director: omdbMovie.Director,
    actors: omdbMovie.Actors,
    runtime: omdbMovie.Runtime,
    type: omdbMovie.Type
  };
  const result = await db.insert(movies).values(newMovie).returning();
  return result[0];
});
const deleteMovie_createServerFn_handler = createServerRpc({
  id: "a9aea98c5acbf05f88d8e86c86f6a0aee623f76574d61e94a84568012e5821a0",
  name: "deleteMovie",
  filename: "src/server/movies.ts"
}, (opts, signal) => deleteMovie.__executeServer(opts, signal));
const deleteMovie = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(deleteMovie_createServerFn_handler, async ({
  data
}) => {
  const id = data;
  await db.delete(movies).where(eq(movies.id, id));
  return {
    success: true
  };
});
const searchMovies_createServerFn_handler = createServerRpc({
  id: "5bf787eebf7ad420dd40cab10af59385eaffb5393bb452c91f194553fe19ffbb",
  name: "searchMovies",
  filename: "src/server/movies.ts"
}, (opts, signal) => searchMovies.__executeServer(opts, signal));
const searchMovies = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(searchMovies_createServerFn_handler, async ({
  data
}) => {
  return await searchMoviesByTitle(data.query, data.type);
});
export {
  addMovie_createServerFn_handler,
  deleteMovie_createServerFn_handler,
  getAllMovies_createServerFn_handler,
  searchMovies_createServerFn_handler
};
