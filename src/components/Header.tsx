import { Link } from '@tanstack/react-router'
import { Clapperboard, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 px-4 h-16 flex items-center bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-cyan-600 rounded-lg group-hover:bg-cyan-500 transition-colors">
            <Clapperboard size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold hidden sm:block text-white">
            Movie Recs
          </span>
        </Link>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center justify-end flex-1 gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          aria-label="View on GitHub"
        >
          <Github size={20} />
        </a>
      </div>
    </header>
  )
}
