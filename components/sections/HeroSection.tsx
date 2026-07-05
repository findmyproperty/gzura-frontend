'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
      </div>

      {/* Decorative Elements - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute top-20 right-10 w-72 h-72 bg-gold-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="hidden sm:block absolute bottom-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container-custom relative z-10 pt-28 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-400 text-sm font-medium">
                Building Leaders Since 2020
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Empowering Men & Women.{' '}
              <span className="block text-gold-400 mt-2">Building Entrepreneurs.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              GZURA is a transformative platform dedicated to leadership
              development, entrepreneurship training, and community building.
              Join a network of ambitious individuals creating lasting impact.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/join" className="w-full sm:w-auto">
                <Button className="btn-secondary w-full sm:w-auto group text-base">
                  Join Community
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/programs" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white text-base"
                >
                  Explore Programs
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 md:mt-12 pt-8 border-t border-white/10">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">5,000+</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">Members</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">200+</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">Programs</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-400">50+</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">Events/Year</p>
              </div>
            </div>
          </div>

          {/* Visual - Hidden on smaller screens, shown on large screens */}
          <div
            className={`hidden lg:block relative transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Gradient Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-gold-400/30 animate-spin-slow" />
                <div className="absolute inset-4 rounded-full border border-purple-300/20" />

                {/* Center Content */}
                <div className="absolute inset-8 rounded-full glass-dark flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center animate-float">
                      <Play className="w-8 h-8 text-purple-950 ml-1" />
                    </div>
                    <p className="text-white font-medium">Watch Our Story</p>
                    <p className="text-white/60 text-sm mt-1">2 min video</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 glass rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        500+ Entrepreneurs
                      </p>
                      <p className="text-xs text-gray-500">Launched in 2024</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 text-lg">★</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        4.9/5 Rating
                      </p>
                      <p className="text-xs text-gray-500">Member satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
