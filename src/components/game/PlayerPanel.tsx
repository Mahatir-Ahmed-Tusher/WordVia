import { forwardRef } from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';
import { Trophy, Sparkles, Gamepad2 } from 'lucide-react';
const player1Avatar = '/player-1.png';
const player2Avatar = '/player-2.png';
const player3Avatar = '/player-3.png';
const player4Avatar = '/player-4.png';

const PLAYER_AVATARS = [player1Avatar, player2Avatar, player3Avatar, player4Avatar];

interface PlayerPanelProps {
  player: Player;
  playerIndex: number;
  isActive: boolean;
  isWinner?: boolean;
}

// Fixed player colors: blue, pink, dark, cyan
const PLAYER_COLORS = [
  { bg: 'from-blue-500 to-blue-600', border: 'border-blue-400', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  { bg: 'from-pink-500 to-pink-600', border: 'border-pink-400', text: 'text-pink-400', glow: 'shadow-pink-500/50' },
  { bg: 'from-slate-600 to-slate-700', border: 'border-slate-400', text: 'text-slate-300', glow: 'shadow-slate-500/50' },
  { bg: 'from-cyan-500 to-cyan-600', border: 'border-cyan-400', text: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
];

export const PlayerPanel = forwardRef<HTMLDivElement, PlayerPanelProps>(
  function PlayerPanel({ player, playerIndex, isActive, isWinner }, ref) {
    const colorScheme = PLAYER_COLORS[playerIndex % PLAYER_COLORS.length];
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-between w-full py-2.5 px-4 rounded-xl transition-all duration-300 border-2 overflow-hidden',
          isActive 
            ? `bg-gradient-to-r ${colorScheme.bg} border-white/30 shadow-lg ${colorScheme.glow}` 
            : `bg-background/40 ${colorScheme.border} border-opacity-30`,
          isWinner && 'ring-2 ring-primary animate-pulse-glow'
        )}
      >
        {/* Animated background for active player */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
        )}
        
        <div className="relative flex items-center gap-2.5">
          {/* Player avatar */}
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center overflow-hidden',
            isActive && 'ring-2 ring-white/50'
          )}>
            {isWinner ? (
              <div className={cn(
                'w-full h-full flex items-center justify-center',
                isActive ? 'bg-white/20' : `bg-gradient-to-br ${colorScheme.bg}`
              )}>
                <Trophy className="w-4 h-4 text-white" />
              </div>
            ) : (
              <img 
                src={PLAYER_AVATARS[playerIndex % PLAYER_AVATARS.length]} 
                alt={`Player ${playerIndex + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {isActive && !isWinner && <Sparkles className="w-4 h-4 text-white/80 animate-pulse" />}
          
          <span className={cn(
            'font-display font-semibold text-sm',
            isActive ? 'text-white' : 'text-foreground'
          )}>
            {player.name}
          </span>
        </div>
        
        <div className="relative flex items-center gap-2">
          {isActive && <Gamepad2 className="w-4 h-4 text-white/60" />}
          <div 
            className={cn(
              'font-display font-bold text-xl tabular-nums',
              isActive ? 'text-white' : colorScheme.text
            )}
            style={{ 
              textShadow: isActive ? '0 2px 8px rgba(0,0,0,0.3)' : undefined 
            }}
          >
            {player.score}
          </div>
        </div>
      </div>
    );
  }
);
