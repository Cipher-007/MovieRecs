import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const movies = sqliteTable('movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  imdbId: text('imdb_id').notNull().unique(),
  title: text('title').notNull(),
  year: text('year'),
  plot: text('plot'),
  poster: text('poster'),
  rating: text('rating'),
  genre: text('genre'),
  director: text('director'),
  actors: text('actors'),
  runtime: text('runtime'),
  type: text('type').notNull().default('movie'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
})

export type Movie = typeof movies.$inferSelect
export type NewMovie = typeof movies.$inferInsert
