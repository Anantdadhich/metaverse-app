import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Animation on page load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Floating element animation
  const floatY = (base: number) => {
    return `${base + Math.sin(Date.now() / 1000) * 10}px`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0823] via-[#1A103C] to-[#2D1B50] text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-purple-700/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-2/3 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Grid effect */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'py-3 bg-[#0F0823]/90 backdrop-blur-md shadow-lg' : 'py-6'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`text-2xl font-bold transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              NEV<span className="text-[#FF6B6B]">VERSE</span>
            </span>
          </div>
          
          <div className={`hidden md:flex space-x-8 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <a href="#features" className="px-2 py-1 hover:text-[#FF6B6B] transition-colors">Features</a>
            <a href="#" className="px-2 py-1 hover:text-[#FF6B6B] transition-colors">Explore</a>
            <a href="#" className="px-2 py-1 hover:text-[#FF6B6B] transition-colors">Community</a>
          </div>
          
          <div className={`flex space-x-4 transition-all duration-500 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <Link
              to="/login"
              className="px-4 py-2 text-sm border border-[#FF6B6B] rounded-full hover:bg-[#FF6B6B]/20 transition-all whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-[#FF6B6B] rounded-full hover:bg-[#FF8787] transition-all whitespace-nowrap"
            >
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <main className="relative pt-32 pb-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Your Digital Life<br />
                <span className="bg-gradient-to-r from-[#FF6B6B] to-purple-500 text-transparent bg-clip-text">
                  In The Metaverse
                </span>
              </h1>
              <p className="text-gray-300 mb-8 max-w-lg text-lg">
                Connect, create, and explore virtual spaces with friends. 
                Our metaverse platform gives you the freedom to build your digital identity 
                and experience a new dimension of social interaction.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/register"
                  className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#FF6B6B] to-pink-600 rounded-full hover:opacity-90 transition-all transform hover:scale-105 font-medium text-center"
                >
                  START YOUR JOURNEY
                </Link>
                <Link
                  to="/login"
                  className="px-6 sm:px-8 py-3 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all font-medium text-center"
                >
                  EXPLORE WORLDS
                </Link>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/30 to-purple-900/30 rounded-full blur-3xl"></div>
              
              {/* Floating elements */}
              <div className="absolute -top-16 -left-8 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-300 rounded-xl opacity-70 blur-sm"
                style={{ transform: `translateY(${floatY(-30)})` }}></div>
              
              <div className="absolute -bottom-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-300 rounded-full opacity-70 blur-sm"
                style={{ transform: `translateY(${floatY(20)})` }}></div>
                
              {/* Main avatar image */}
              <div className="relative z-10 mx-auto">
                <img
                  src="/chat.png"
                  alt="Metaverse Avatar"
                  className="w-full max-w-md mx-auto rounded-2xl object-contain"
                />
              </div>
              
              {/* Interface overlay elements */}
              <div className="absolute top-1/4 -right-4 sm:-right-10 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/20 transform rotate-6 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B6B]"></div>
                  <div>
                    <div className="text-xs font-bold">LIVE EVENT</div>
                    <div className="text-xs text-gray-300">Virtual Concert</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 -left-4 sm:-left-10 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/20 transform -rotate-6 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500"></div>
                  <div>
                    <div className="text-xs font-bold">NEW WORLD</div>
                    <div className="text-xs text-gray-300">Fantasy Island</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features section */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Metaverse Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover all the amazing capabilities of our platform that make your metaverse experience unique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: "🌎",
                title: "Custom Worlds",
                description: "Create and customize your own virtual spaces with intuitive tools"
              },
              {
                icon: "👤",
                title: "Unique Avatars",
                description: "Express yourself with fully customizable avatars and accessories"
              },
              {
                icon: "🎮",
                title: "Interactive Games",
                description: "Play and compete with friends in immersive multiplayer games"
              },
              {
                icon: "💬",
                title: "Social Experiences",
                description: "Connect with friends and meet new people in virtual social hubs"
              },
              {
                icon: "🎭",
                title: "Live Events",
                description: "Attend concerts, exhibitions, and conferences in the metaverse"
              },
              {
                icon: "💰",
                title: "Virtual Economy",
                description: "Trade virtual items and create your digital asset portfolio"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FF6B6B]/30 transition-all hover:transform hover:scale-[1.02] hover:bg-white/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#2D1B50] to-[#4E1A3D] rounded-3xl p-8 md:p-16 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B6B]/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Enter the Metaverse?</h2>
                <p className="text-gray-300 max-w-lg">
                  Join thousands of users already exploring virtual worlds, attending events, and making new connections.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#FF6B6B] rounded-full hover:bg-[#FF8787] transition-all transform hover:scale-105 font-medium text-center whitespace-nowrap"
                >
                  GET STARTED
                </Link>
                <Link
                  to="/login"
                  className="px-6 sm:px-8 py-3 sm:py-4 border border-white/30 rounded-full hover:bg-white/10 transition-all font-medium text-center whitespace-nowrap"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};