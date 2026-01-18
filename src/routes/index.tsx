import { createFileRoute, Link } from '@tanstack/react-router'
import { Film, Plus, Star, Sparkles, Clapperboard, ArrowRight, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const features = [
    {
      icon: <Film className="w-8 h-8" />,
      title: 'Track Your Movies',
      description: 'Add movies from IMDB and keep track of your entire collection in one place.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Ratings & Details',
      description: 'View ratings, plot summaries, cast information, and more for every movie.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Beautiful Design',
      description: 'Enjoy a modern, sleek interface that makes browsing your collection a pleasure.',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-transparent rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-gradient-to-tl from-purple-600/30 via-pink-500/20 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[50%] w-[40%] h-[40%] bg-gradient-to-r from-orange-500/10 via-red-500/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center">
        <div className="relative max-w-5xl mx-auto">
          {/* Glowing orb behind logo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-[80px] opacity-40" />
          
          {/* Logo */}
          <div className="relative flex items-center justify-center gap-4 mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-5 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl">
                <Clapperboard className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              Movie
            </span>
            <br />
            <span className="text-white">
              Recommendations
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent mb-4 font-light max-w-2xl mx-auto">
            Your personal movie collection, beautifully organized
          </p>
          <p className="text-gray-500 max-w-xl mx-auto mb-12 text-lg">
            Add movies by their IMDB ID and build your curated collection with detailed information, ratings, and stunning visuals.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group relative px-10 py-5 overflow-hidden rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3 text-white">
                <Zap className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/dashboard"
              className="group px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:bg-white/10"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why use Movie Recommendations?
          </span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
          Everything you need to manage your personal movie collection
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              <div className="absolute inset-[1px] bg-gradient-to-br from-white/10 to-white/5 rounded-3xl" />
              <div className="absolute inset-[1px] bg-[#0a0a0f]/90 rounded-3xl" />
              
              {/* Content */}
              <div className="relative">
                <div className={`mb-6 p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl w-fit shadow-lg`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How it Works
          </span>
        </h2>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-purple-500/40 to-pink-500/20" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {[
              { step: '1', title: 'Find a Movie', desc: 'Go to IMDB and find a movie you love', color: 'from-cyan-500 to-blue-500' },
              { step: '2', title: 'Copy the ID', desc: 'Copy the ID from the URL (e.g., tt0111161)', color: 'from-purple-500 to-pink-500' },
              { step: '3', title: 'Add to Collection', desc: 'Paste it in the dashboard and you\'re done!', color: 'from-orange-500 to-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex-1 text-center group">
                <div className="relative inline-block mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-24 px-6 text-center">
        <div className="relative max-w-3xl mx-auto">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
          
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build your collection?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Start adding movies now and create your personalized movie library.
            </p>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-6 h-6" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
