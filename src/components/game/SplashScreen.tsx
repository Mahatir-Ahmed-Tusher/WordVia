import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useFirstVisit } from '@/hooks/useFirstVisit';
const wordviaLogo = '/wordvia-logo.png';

export function SplashScreen() {
  const { dispatch } = useGame();
  const [isAnimating, setIsAnimating] = useState(true);
  const { isFirstVisit, visitCount } = useFirstVisit();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        // First-time visitors see the tour, returning visitors go to mode select
        dispatch({ type: 'SET_PHASE', phase: isFirstVisit ? 'tour' : 'mode-select' });
      }, 600);
    }, 2800);

    return () => clearTimeout(timer);
  }, [dispatch, isFirstVisit]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large rotating glow ring */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-rotate-slow opacity-20"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent, hsl(var(--accent)), transparent)',
          }}
        />
        
        {/* Floating orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-float"
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/25 rounded-full blur-[120px] animate-float" 
          style={{ animationDelay: '1.5s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lavender-medium/15 rounded-full blur-[80px] animate-glow-pulse" 
        />
      </div>

      {/* Particle sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-60"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div 
        className={`relative z-10 text-center transition-all duration-700 ease-out ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Logo with enhanced glow effect */}
        <div className="relative mb-8 animate-scale-bounce">
          {/* Outer glow ring */}
          <div 
            className="absolute inset-0 rounded-full blur-3xl animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.7) 0%, hsl(var(--primary) / 0.3) 40%, transparent 70%)',
              transform: 'scale(2)',
            }}
          />
          {/* Inner glow */}
          <div 
            className="absolute inset-0 blur-2xl animate-breathe"
            style={{
              background: 'radial-gradient(circle, hsl(var(--gold-light) / 0.6) 0%, transparent 60%)',
              transform: 'scale(1.5)',
            }}
          />
          {/* Logo image - enlarged */}
          <img 
            src={wordviaLogo} 
            alt="Wordvia Logo" 
            className="relative w-80 h-80 sm:w-96 sm:h-96 object-contain mx-auto drop-shadow-2xl animate-breathe"
            style={{
              filter: 'drop-shadow(0 0 40px hsl(var(--primary) / 0.7)) drop-shadow(0 0 80px hsl(var(--primary) / 0.4))',
            }}
          />
        </div>

        {/* Tagline with glow */}
        <p 
          className="text-2xl text-foreground/80 font-display font-medium animate-slide-up glow-text"
          style={{ animationDelay: '0.6s' }}
        >
          {isFirstVisit ? 'Welcome to WordVia!' : 'The Ultimate Word Game'}
        </p>

        {/* Visit counter */}
        {!isFirstVisit && visitCount > 1 && (
          <p 
            className="text-sm text-muted-foreground font-display mt-2 animate-slide-up"
            style={{ animationDelay: '0.8s' }}
          >
            Visit #{visitCount}
          </p>
        )}

        {/* Loading indicator with glow */}
        <div 
          className="mt-10 flex justify-center gap-3 animate-slide-up"
          style={{ animationDelay: '1s' }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-primary animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 15px hsl(var(--primary) / 0.6)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative floating letter tiles */}
      {['W', 'O', 'R', 'D'].map((letter, index) => (
        <div
          key={letter}
          className="absolute w-14 h-14 bg-card rounded-xl shadow-xl flex items-center justify-center font-display font-bold text-2xl text-card-foreground animate-float"
          style={{
            top: `${15 + index * 18}%`,
            left: index % 2 === 0 ? '8%' : '85%',
            animationDelay: `${index * 0.4}s`,
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3), 0 10px 40px -10px hsl(0 0% 0% / 0.3)',
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}
