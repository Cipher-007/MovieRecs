import { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import { searchMovies } from '../server/movies';
import type { OMDBSearchResult } from '../server/omdb';

interface AddMovieFormProps {
  onSubmit: (imdbId: string) => Promise<void>;
}

export default function AddMovieForm({ onSubmit }: AddMovieFormProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OMDBSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const data = await searchMovies({ data: searchTerm });
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError('Failed to search movies');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length > 2) {
      debounceRef.current = setTimeout(() => {
        handleSearch(value);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectMovie = async (movie: OMDBSearchResult) => {
    // Select logic
    setIsAdding(true);
    setError(null);
    setSuccess(false);
    setShowResults(false);
    setQuery('');

    try {
      await onSubmit(movie.imdbID);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add movie');
      setQuery(movie.Title); // Restore query so user can try again if they want
    } finally {
      setIsAdding(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-md relative">
      <div className="flex flex-col gap-3">
        <label htmlFor="movie-search" className="text-sm font-medium text-gray-400">
          Add a movie by title
        </label>
        
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>

          <input
            id="movie-search"
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 2 && setShowResults(true)}
            placeholder="Search for a movie..."
            disabled={isAdding}
            className="w-full pl-11 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 transition-all"
            autoComplete="off"
          />

          {query && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-80 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {results.map((movie) => (
              <button
                key={movie.imdbID}
                onClick={() => handleSelectMovie(movie)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700 last:border-0"
              >
                <div className="w-10 h-14 bg-slate-900 rounded overflow-hidden flex-shrink-0">
                  {movie.Poster !== 'N/A' ? (
                    <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white line-clamp-1">{movie.Title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{movie.Year}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="uppercase">{movie.Type}</span>
                  </div>
                </div>
                <div className="ml-auto">
                   <Plus size={16} className="text-cyan-400" />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Loading State for Search */}
        {isSearching && showResults && results.length === 0 && (
           <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center z-50">
             <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
             <p className="text-sm text-gray-400">Searching...</p>
           </div>
        )}

        {/* No Results */}
        {!isSearching && query.length > 2 && showResults && results.length === 0 && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center z-50">
              <p className="text-sm text-gray-400">No movies found</p>
            </div>
        )}

        {/* Helper text if not Success/Error */}
        {!error && !success && !isAdding && (
          <p className="text-xs text-gray-500">
            Type at least 3 characters to search
          </p>
        )}
        
        {/* Loading Add */}
        {isAdding && (
           <div className="flex items-center gap-2 text-cyan-400 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3">
             <Loader2 size={16} className="animate-spin" />
             Adding movie...
           </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded-xl p-3">
            <CheckCircle size={16} />
            Movie added successfully!
          </div>
        )}
      </div>
    </div>
  )
}
