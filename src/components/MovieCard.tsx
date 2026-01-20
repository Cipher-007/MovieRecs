import { Star, Clock, Trash2, User } from 'lucide-react'
import type { Movie } from '../db/schema'

interface MovieCardProps {
  movie: Movie
  onDelete?: (id: number) => void
}

export default function MovieCard({ movie, onDelete }: MovieCardProps) {
  const posterUrl = movie.poster || '/placeholder-movie.svg'
  
  return (
    <div className="group relative h-[350px] bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors flex flex-col">
      {/* Poster - reduced height */}
      <div className="relative h-[216px] flex-shrink-0 overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-movie.svg'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Rating badge */}
        {movie.rating && movie.rating !== 'N/A' && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">
            <Star size={10} fill="currentColor" />
            {movie.rating}
          </div>
        )}
        
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(movie.id)}
            className="absolute top-2 left-2 p-1.5 bg-red-600 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        )}
        
        {/* Title at bottom of poster */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <h3 className="text-sm font-semibold text-white line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/60">
            {movie.year && <span>{movie.year}</span>}
            {movie.runtime && movie.runtime !== 'N/A' && (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {movie.runtime}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Content - compact */}
      <div className="flex-1 p-2.5 flex flex-col overflow-hidden">
        {/* Genre tags */}
        {movie.genre && movie.genre !== 'N/A' && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {movie.genre.split(', ').slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/70 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* Plot */}
        {movie.plot && movie.plot !== 'N/A' && (
          <p className="text-[11px] text-white/50 line-clamp-3 leading-relaxed flex-1">
            {movie.plot}
          </p>
        )}
        
        {/* Director */}
        {movie.director && movie.director !== 'N/A' && (
          <div className="flex items-center gap-1.5 text-[10px] text-white/40 pt-1.5 mt-auto border-t border-white/10">
            <User size={10} />
            <span className="truncate">Dir: {movie.director}</span>
          </div>
        )}
      </div>
    </div>
  )
}
