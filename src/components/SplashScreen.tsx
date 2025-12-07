import { useEffect, useState } from 'react';
import { Car, Sparkles } from 'lucide-react';
import oxxoViajeLogo from '../assets/logo-sin-fondo-1.png';

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-orange-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
        
        {/* Car icons floating */}
        <div className="absolute top-1/4 left-1/3 text-white/10 animate-float" style={{ animationDelay: '0s' }}>
          <Car className="size-16" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-white/10 animate-float" style={{ animationDelay: '2s' }}>
          <Car className="size-20" />
        </div>
        <div className="absolute top-2/3 left-1/4 text-white/10 animate-float" style={{ animationDelay: '1s' }}>
          <Car className="size-12" />
        </div>

        {/* Sparkles */}
        <div className="absolute top-1/4 right-1/4 text-yellow-300/30 animate-twinkle">
          <Sparkles className="size-8" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-yellow-300/30 animate-twinkle" style={{ animationDelay: '1s' }}>
          <Sparkles className="size-6" />
        </div>
        <div className="absolute top-1/2 right-1/3 text-yellow-300/30 animate-twinkle" style={{ animationDelay: '2s' }}>
          <Sparkles className="size-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Logo Container with Animation */}
        <div className="relative mb-8 animate-fade-in">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
          
          {/* Logo */}
          <div className="relative p-8 transform hover:scale-105 transition-transform duration-300">
            <img 
              src={oxxoViajeLogo} 
              alt="OXXO Viaje" 
              className="h-32 w-auto animate-bounce-slow drop-shadow-2xl"
            />
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg animate-pulse"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-lg animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* App Name */}
        <div className="text-center mb-8 space-y-2 animate-slide-up">
          <h1 className="text-5xl text-white tracking-wider drop-shadow-lg animate-fade-in">
            OXXO Viajes
          </h1>
          <div className="flex items-center justify-center gap-2 text-red-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Car className="size-5" />
            <p className="text-lg">Tu transporte seguro y rápido</p>
            <Car className="size-5" />
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="flex justify-between items-center text-white/90 text-sm">
            <span className="animate-pulse">Cargando...</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-white/70 text-sm animate-fade-in tracking-wide" style={{ animationDelay: '0.8s' }}>
          Conectando destinos, creando experiencias
        </p>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        <svg viewBox="0 0 1440 120" className="w-full h-full">
          <path 
            fill="white" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            className="animate-wave"
          />
        </svg>
      </div>
    </div>
  );
}
