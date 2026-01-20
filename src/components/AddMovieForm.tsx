import { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, AlertCircle, CheckCircle, Search, X, Command } from 'lucide-react';
import { searchMovies } from '../server/movies';
import type { OMDBSearchResult } from '../server/omdb';

interface AddMovieFormProps {
  onSubmit: (imdbId: string) => Promise<void>;
}

export default function AddMovieForm({ onSubmit }: AddMovieFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<OMDBSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleArrowNav = (e: KeyboardEvent) => {
      if (results.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        handleSelectMovie(results[selectedIndex]);
      }
    };
    document.addEventListener('keydown', handleArrowNav);
    return () => document.removeEventListener('keydown', handleArrowNav);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => { setSelectedIndex(0); }, [results]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) closeModal();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      const trimmedQuery = debouncedQuery.trim();
      if (trimmedQuery.length <= 2) { setResults([]); return; }
      setIsSearching(true);
      setError(null);
      try {
        const data = await searchMovies({ data: { query: debouncedQuery } });
        setResults(data);
      } catch (err) {
        console.error(err);
        setError('Search failed');
      } finally {
        setIsSearching(false);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  const closeModal = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setError(null);
  };

  const handleSelectMovie = async (movie: OMDBSearchResult) => {
    setIsAdding(true);
    setError(null);
    try {
      await onSubmit(movie.imdbID);
      setSuccess(true);
      closeModal();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/60 hover:text-white transition-all text-sm"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/40 ml-2">
          <Command size={10} />K
        </kbd>
      </button>

      {/* Success Toast */}
      {success && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 text-white text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 z-[60] backdrop-blur-sm">
          <CheckCircle size={16} />
          Added successfully!
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div
            ref={modalRef}
            className="relative w-full max-w-xl mx-4 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={18} className="text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies & TV shows..."
                disabled={isAdding}
                className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                autoComplete="off"
              />
              {isSearching && <Loader2 size={16} className="text-white animate-spin" />}
              {query && !isSearching && (
                <button onClick={() => setQuery('')} className="text-white/40 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto">
              {isSearching && query.trim().length > 2 && (
                <div className="p-6 text-center text-white/40 text-sm">Searching...</div>
              )}

              {!isSearching && results.length > 0 && (
                <div className="py-2">
                  {results.map((movie, index) => (
                    <button
                      key={movie.imdbID}
                      onClick={() => handleSelectMovie(movie)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selectedIndex === index ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-10 h-14 bg-white/10 rounded overflow-hidden flex-shrink-0">
                        {movie.Poster !== 'N/A' ? (
                          <img src={movie.Poster} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">N/A</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{movie.Title}</div>
                        <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                          <span>{movie.Year}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-medium bg-white/10">
                            {movie.Type === 'movie' ? 'Movie' : 'Series'}
                          </span>
                        </div>
                      </div>
                      <Plus size={16} className={`text-white transition-opacity ${
                        selectedIndex === index ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </button>
                  ))}
                </div>
              )}

              {!isSearching && results.length === 0 && query.trim().length > 2 && (
                <div className="p-6 text-center text-white/40 text-sm">No results found</div>
              )}

              {!isSearching && query.trim().length <= 2 && (
                <div className="p-6 text-center text-white/40 text-sm">Type to search...</div>
              )}

              {error && (
                <div className="mx-4 mb-4 p-3 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {isAdding && (
                <div className="mx-4 mb-4 p-3 flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-lg text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-xs text-white/30">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 py-0.5 bg-white/10 rounded">↑↓</kbd> Navigate</span>
                <span><kbd className="px-1 py-0.5 bg-white/10 rounded">↵</kbd> Add</span>
              </div>
              <span><kbd className="px-1 py-0.5 bg-white/10 rounded">esc</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
