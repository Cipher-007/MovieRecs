import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Film, Loader2, Plus, Tv, Clapperboard, Github } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'movie' | 'series'>('movie')

  const filteredMovies = movies.filter((movie) => 
    activeTab === 'movie' ? movie.type === 'movie' : movie.type === 'series'
  )

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
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 h-14 flex items-center justify-between backdrop-blur-md bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] bg-black/80">
        <Link to="/" className="flex items-center gap-2">
          <Clapperboard size={20} className="text-white" />
          <span className="font-semibold text-white">MovieRecs</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
      </header>

      <div className="relative py-6 px-6 max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-lg">
            <button
              onClick={() => setActiveTab('movie')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'movie'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Film size={16} />
              Movies
              <span className={`px-1.5 py-0.5 text-xs rounded ${
                activeTab === 'movie' ? 'bg-black/10' : 'bg-white/10'
              }`}>
                {movies.filter(m => m.type === 'movie').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'series'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Tv size={16} />
              TV Shows
              <span className={`px-1.5 py-0.5 text-xs rounded ${
                activeTab === 'series' ? 'bg-black/10' : 'bg-white/10'
              }`}>
                {movies.filter(m => m.type === 'series').length}
              </span>
            </button>
          </div>
          
          {/* Search */}
          <AddMovieForm onSubmit={handleAddMovie} />
        </div>

        {/* Grid */}
        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-5 rounded-full mb-5 bg-white/5 border border-white/10">
              {activeTab === 'movie' ? (
                <Film className="w-10 h-10 text-white/40" />
              ) : (
                <Tv className="w-10 h-10 text-white/40" />
              )}
            </div>
            
            <h2 className="text-xl font-medium text-white mb-2">
              No {activeTab === 'movie' ? 'movies' : 'TV shows'} yet
            </h2>
            <p className="text-white/40 max-w-sm mb-6 text-sm">
              Search above to add {activeTab === 'movie' ? 'movies' : 'TV shows'} to your collection.
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {(activeTab === 'movie' ? [
                { id: 'tt0111161', name: 'Shawshank Redemption' },
                { id: 'tt0468569', name: 'The Dark Knight' },
                { id: 'tt1375666', name: 'Inception' },
              ] : [
                { id: 'tt0903747', name: 'Breaking Bad' },
                { id: 'tt0944947', name: 'Game of Thrones' },
                { id: 'tt4574334', name: 'Stranger Things' },
              ]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddMovie(item.id)}
                  className="group px-3 py-1.5 rounded-full text-sm transition-all bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 flex items-center gap-1.5"
                >
                  <Plus size={14} className="transition-transform group-hover:rotate-90" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="relative">
                {isDeleting === movie.id && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
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
