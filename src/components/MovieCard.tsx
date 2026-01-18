import { Star, Clock, Film, Trash2, User } from 'lucide-react'
import type { Movie } from '../db/schema'

interface MovieCardProps {
  movie: Movie
  onDelete?: (id: number) => void
}

export default function MovieCard({ movie, onDelete }: MovieCardProps) {
  const posterUrl = movie.poster || '/placeholder-movie.svg'
  
  return (
    <div className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-xl">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-movie.svg'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        {/* Rating badge */}
        {movie.rating && movie.rating !== 'N/A' && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold">
            <Star size={14} fill="currentColor" />
            {movie.rating}
          </div>
        )}
        
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(movie.id)}
            className="absolute top-3 left-3 p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
            title="Remove from collection"
          >
            <Trash2 size={16} />
          </button>
        )}
        
        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {movie.year && <span className="font-medium">{movie.year}</span>}
            {movie.runtime && movie.runtime !== 'N/A' && (
              <span className="flex items-center gap-1 text-gray-400">
                <Clock size={12} />
                {movie.runtime}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 pt-2">
        {/* Genre tags */}
        {movie.genre && movie.genre !== 'N/A' && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {movie.genre.split(', ').slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2.5 py-1 bg-slate-700 text-cyan-400 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* Plot */}
        {movie.plot && movie.plot !== 'N/A' && (
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {movie.plot}
          </p>
        )}
        
        {/* Director */}
        {movie.director && movie.director !== 'N/A' && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-slate-700">
            <User size={12} />
            <span>Dir: {movie.director}</span>
          </div>
        )}
      </div>
    </div>
  )
}
