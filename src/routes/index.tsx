import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Film, Plus, Star, Sparkles, Clapperboard, ArrowRight, Github } from 'lucide-react'
import { Spotlight } from '../components/Spotlight'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const [showSpotlight, setShowSpotlight] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setShowSpotlight(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <Film className="w-6 h-6" />,
      title: 'Track Your Movies',
      description: 'Add movies from IMDB and keep track of your entire collection in one place.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Ratings & Details',
      description: 'View ratings, plot summaries, cast information, and more for every movie.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Beautiful Design',
      description: 'Enjoy a modern, sleek interface that makes browsing your collection a pleasure.',
    },
  ]

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />
      {/* Spotlight effect - fixed above header, hides on scroll */}
      {showSpotlight && <Spotlight className="fixed -top-40 left-[30%] z-30" fill="white" />}
      {/* Header */}
      <header className="sticky top-0 z-40 px-6 h-14 flex items-center justify-between backdrop-blur-md bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100px_100px] bg-black/80">
        <Link to="/" className="flex items-center gap-2">
          <Clapperboard size={20} className="text-white" />
          <span className="font-semibold text-white">MovieRecs</span>
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-white transition-colors"
        >
          <Github size={18} />
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center">
        
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <Clapperboard className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Movie
            <br />
            <span className="text-white/60">Recommendations</span>
          </h1>
          
          <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
            Your personal movie collection, beautifully organized. Track movies and TV shows with detailed information and ratings.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 text-white/70 hover:text-white font-medium transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-12">
          Why use MovieRecs?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
            >
              <div className="mb-4 p-3 bg-white/10 rounded-lg w-fit text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-12">
          How it Works
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {[
            { step: '1', title: 'Search', desc: 'Find any movie or TV show' },
            { step: '2', title: 'Select', desc: 'Pick from the results' },
            { step: '3', title: 'Add', desc: 'Save to your collection' },
          ].map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-medium">
                {item.step}
              </div>
              <h3 className="font-medium text-white mb-1">{item.title}</h3>
              <p className="text-sm text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-md mx-auto p-8 bg-white/5 border border-white/10 rounded-2xl">
          <h2 className="text-xl font-semibold text-white mb-3">
            Ready to start?
          </h2>
          <p className="text-white/50 mb-6 text-sm">
            Build your personalized movie library today.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-colors"
          >
            <Plus size={16} />
            Go to Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-white/30 text-sm border-t border-white/10">
        MovieRecs — Your personal movie collection
      </footer>
    </div>
  )
}
