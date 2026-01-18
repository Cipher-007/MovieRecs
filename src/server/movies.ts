import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { movies, type NewMovie } from '../db/schema'
import { fetchMovieByImdbId } from './omdb'
import { eq } from 'drizzle-orm'

// Get all movies
export const getAllMovies = createServerFn({ method: 'GET' }).handler(async () => {
  const allMovies = await db.select().from(movies).orderBy(movies.createdAt)
  return allMovies
})

// Add a movie by IMDB ID
export const addMovie = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const imdbId = data

    // Validate IMDB ID format
    if (!imdbId || !imdbId.startsWith('tt')) {
      throw new Error('Invalid IMDB ID. It should start with "tt"')
    }

    // Check if movie already exists
    const existing = await db
      .select()
      .from(movies)
      .where(eq(movies.imdbId, imdbId))
      .limit(1)

    if (existing.length > 0) {
      throw new Error('Movie already exists in your collection')
    }

    // Fetch movie details from OMDB
    const omdbMovie = await fetchMovieByImdbId(imdbId)

    if (!omdbMovie) {
      throw new Error('Movie not found. Please check the IMDB ID')
    }

    // Insert movie into database
    const newMovie: NewMovie = {
      imdbId: omdbMovie.imdbID,
      title: omdbMovie.Title,
      year: omdbMovie.Year,
      plot: omdbMovie.Plot,
      poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
      rating: omdbMovie.imdbRating,
      genre: omdbMovie.Genre,
      director: omdbMovie.Director,
      actors: omdbMovie.Actors,
      runtime: omdbMovie.Runtime,
    }

    const result = await db.insert(movies).values(newMovie).returning()

    return result[0]
  })

// Delete a movie
export const deleteMovie = createServerFn({ method: 'POST' })
  .inputValidator((d: number) => d)
  .handler(async ({ data }) => {
    const id = data
    await db.delete(movies).where(eq(movies.id, id))
    return { success: true }
  })

// Search movies
import { searchMoviesByTitle } from './omdb'

export const searchMovies = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    return await searchMoviesByTitle(data)
  })
