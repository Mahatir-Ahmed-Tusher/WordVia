"use client";

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { HomeButton } from './HomeButton';
import { ChevronRight } from 'lucide-react';
const wordviaLogo = '/wordvia-logo.png';
const humanVsHumanIcon = '/human-vs-human.png';
const humanVsRobotIcon = '/human-vs-robot.png';

export type GameMode = 'pvp' | 'pvb';

interface ModeSelectionProps {
  onModeSelect: (mode: GameMode) => void;
}

export function ModeSelection({ onModeSelect }: ModeSelectionProps) {
  const [hoveredMode, setHoveredMode] = useState<GameMode | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col relative overflow-hidden">
      {/* Home button */}
      <HomeButton />
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header with logo */}
      <div className="relative z-10 text-center mb-12 animate-slide-up">
        <div className="relative inline-block">
          <div 
            className="absolute inset-0 blur-2xl animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)',
              transform: 'scale(1.8)',
            }}
          />
          <div 
            className="absolute inset-0 blur-xl animate-breathe"
            style={{
              background: 'radial-gradient(circle, hsl(var(--gold-light) / 0.4) 0%, transparent 60%)',
              transform: 'scale(1.4)',
            }}
          />
          <img 
            src={wordviaLogo} 
            alt="Wordvia" 
            className="relative w-36 h-36 sm:w-44 sm:h-44 object-contain mx-auto animate-breathe"
            style={{
              filter: 'drop-shadow(0 0 25px hsl(var(--primary) / 0.6)) drop-shadow(0 0 50px hsl(var(--primary) / 0.3))',
            }}
          />
        </div>
        <p className="text-muted-foreground mt-3 font-display text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Choose your game mode
        </p>
      </div>

      {/* Mode selection cards */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full space-y-4">
        {/* Human vs Human */}
        <button
          onClick={() => onModeSelect('pvp')}
          onMouseEnter={() => setHoveredMode('pvp')}
          onMouseLeave={() => setHoveredMode(null)}
          className="w-full glass-card p-6 flex items-center gap-4 animate-slide-up transition-all duration-300 hover:scale-[1.02] group"
          style={{ 
            animationDelay: '0.15s',
            borderColor: hoveredMode === 'pvp' ? 'hsl(var(--primary))' : undefined,
            boxShadow: hoveredMode === 'pvp' ? '0 0 30px hsl(var(--primary) / 0.3)' : undefined,
          }}
        >
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img src={humanVsHumanIcon} alt="Human vs Human" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              Human vs Human
            </h3>
            <p className="text-sm text-muted-foreground">
              Play with friends locally. 2-4 players take turns.
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Human vs Bot */}
        <button
          onClick={() => onModeSelect('pvb')}
          onMouseEnter={() => setHoveredMode('pvb')}
          onMouseLeave={() => setHoveredMode(null)}
          className="w-full glass-card p-6 flex items-center gap-4 animate-slide-up transition-all duration-300 hover:scale-[1.02] group"
          style={{ 
            animationDelay: '0.25s',
            borderColor: hoveredMode === 'pvb' ? 'hsl(var(--accent))' : undefined,
            boxShadow: hoveredMode === 'pvb' ? '0 0 30px hsl(var(--accent) / 0.3)' : undefined,
          }}
        >
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img src={humanVsRobotIcon} alt="Human vs Bot" className="w-12 h-12 object-contain" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-display text-xl font-bold text-foreground mb-1">
              Human vs Bot
            </h3>
            <p className="text-sm text-muted-foreground">
              Challenge the AI! 1-3 humans vs smart bot.
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
