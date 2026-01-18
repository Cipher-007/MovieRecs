import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Clapperboard, Home, LayoutDashboard, Menu, X, Github } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-cyan-600 rounded-lg">
            <Clapperboard size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold hidden sm:block text-white">
            Movie Recs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 rounded-xl hover:bg-slate-800"
            activeProps={{ className: 'px-4 py-2 bg-slate-800 text-white flex items-center gap-2 rounded-xl' }}
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 rounded-xl hover:bg-slate-800"
            activeProps={{ className: 'px-4 py-2 bg-slate-800 text-white flex items-center gap-2 rounded-xl' }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </nav>

        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 hover:bg-slate-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          aria-label="View on GitHub"
        >
          <Github size={20} />
        </a>
      </header>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600 rounded-lg">
              <Clapperboard size={18} />
            </div>
            <span className="font-bold text-lg text-white">Movie Recs</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors mb-2 text-gray-400 hover:text-white"
            activeProps={{
              className: 'flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors mb-2 text-gray-400 hover:text-white"
            activeProps={{
              className: 'flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white mb-2',
            }}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-gray-500 text-center">
            Built with TanStack Start
          </p>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
