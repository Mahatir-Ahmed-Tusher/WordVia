import { useGame } from '@/context/GameContext';
import { PlayerPanel } from './PlayerPanel';
import { HomeButton } from './HomeButton';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
const wordviaLogo = '/wordvia-logo.png';
const winnerTrophy = '/winner-trophy.png';
const drawTrophy = '/draw-trophy.png';

export function GameOver() {
  const { state, dispatch } = useGame();
  const [showConfetti, setShowConfetti] = useState(true);

  // Sort players by score
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  
  // Check if it's a draw (top players have same score)
  const isDraw = sortedPlayers.length >= 2 && sortedPlayers[0].score === sortedPlayers[1].score;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Home button */}
      <HomeButton />
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '110%',
                backgroundColor: ['hsl(45, 96%, 55%)', 'hsl(280, 70%, 60%)', 'hsl(160, 70%, 45%)', 'hsl(20, 90%, 55%)', 'hsl(0, 0%, 100%)'][i % 5],
                animation: `confetti ${2.5 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Logo */}
      <div className="relative mb-4 animate-scale-bounce">
        <div 
          className="absolute inset-0 blur-2xl animate-glow-pulse"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
        />
        <img 
          src={wordviaLogo} 
          alt="Wordvia" 
          className="relative w-28 h-28 object-contain"
          style={{
            filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.6))',
          }}
        />
      </div>

      {/* Winner/Draw announcement */}
      <div className="relative z-10 text-center mb-8 animate-slide-up">
        <div className="relative mb-4">
          <img 
            src={isDraw ? drawTrophy : winnerTrophy} 
            alt={isDraw ? "Draw" : "Winner Trophy"} 
            className="w-36 h-36 object-contain mx-auto"
          />
        </div>
        <h1 className="text-5xl font-display font-bold text-primary glow-text mb-3">
          {isDraw ? 'The Game is a Draw!' : 'Game Over!'}
        </h1>
        {!isDraw && (
          <p className="text-2xl text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display font-bold" style={{ color: winner.color }}>
              {winner.name}
            </span>
            {' '}wins!
            <Sparkles className="w-6 h-6 text-primary" />
          </p>
        )}
      </div>

      {/* Final scores */}
      <div className="relative z-10 w-full max-w-md space-y-3 mb-8">
        <h2 className="font-display font-semibold text-center text-muted-foreground mb-4 text-lg">
          Final Scores
        </h2>
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center gap-4 glass-card p-4 animate-slide-up"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xl shadow-lg"
              style={{ 
                backgroundColor: index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                color: index === 0 ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))',
                boxShadow: index === 0 ? '0 0 20px hsl(var(--primary) / 0.5)' : undefined,
              }}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <span className="font-display font-semibold text-lg text-foreground">{player.name}</span>
            </div>
            <div 
              className="font-display font-bold text-3xl" 
              style={{ 
                color: player.color,
                textShadow: `0 0 15px ${player.color}50`,
              }}
            >
              {player.score}
            </div>
            {index === 0 && <Trophy className="w-7 h-7 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }} />}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="relative z-10 w-full max-w-md animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <Button
          onClick={handlePlayAgain}
          className="w-full h-16 game-button game-button-primary text-xl"
        >
          <RotateCcw className="w-6 h-6 mr-3" />
          Play Again
        </Button>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-8 text-center text-muted-foreground text-sm font-display animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <p>Turns played: {state.turnHistory.length}</p>
        <p>
          Total words formed:{' '}
          {state.turnHistory.reduce(
            (sum, t) => sum + (t.wordsFormed?.filter(w => w.isValid).length || 0),
            0
          )}
        </p>
      </div>
    </div>
  );
}
