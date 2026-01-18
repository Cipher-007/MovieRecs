import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Film, Loader2, Plus } from 'lucide-react'
import MovieCard from '../components/MovieCard'
import AddMovieForm from '../components/AddMovieForm'
import { getAllMovies, addMovie, deleteMovie } from '../server/movies'
import type { Movie } from '../db/schema'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  loader: async () => await getAllMovies(),
})

function Dashboard() {
  const router = useRouter()
  const movies = Route.useLoaderData() as Movie[]
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleAddMovie = async (imdbId: string) => {
    await addMovie({ data: imdbId })
    router.invalidate()
  }

  const handleDeleteMovie = async (id: number) => {
    setIsDeleting(id)
    try {
      await deleteMovie({ data: id })
      router.invalidate()
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="py-10 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Your Collection
            </h1>
            <p className="text-gray-400 text-lg">
              {movies.length} {movies.length === 1 ? 'movie' : 'movies'} in your collection
            </p>
          </div>
          
          <AddMovieForm onSubmit={handleAddMovie} />
        </div>

        {/* Movies Grid */}
        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-8 bg-slate-800 rounded-full mb-8">
              <Film className="w-16 h-16 text-gray-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">
              No movies yet
            </h2>
            <p className="text-gray-400 max-w-md mb-8 text-lg">
              Start building your collection by adding movies using their IMDB ID.
            </p>
            
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <p className="text-gray-400 mb-4">Try adding one of these popular movies:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { id: 'tt0111161', name: 'Shawshank Redemption' },
                  { id: 'tt0468569', name: 'The Dark Knight' },
                  { id: 'tt1375666', name: 'Inception' },
                ].map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleAddMovie(movie.id)}
                    className="group px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
                    <code className="text-cyan-400 text-sm">{movie.id}</code>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="relative">
                {isDeleting === movie.id && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <div className="flex items-center gap-3 text-white">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                      <span>Removing...</span>
                    </div>
                  </div>
                )}
                <MovieCard 
                  movie={movie} 
                  onDelete={handleDeleteMovie}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
