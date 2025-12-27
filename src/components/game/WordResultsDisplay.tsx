import { useState } from 'react';
import { WordResult } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, BookOpen, Sparkles, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordResultsDisplayProps {
  results: WordResult[];
  onContinue: () => void;
  challengeMode?: boolean;
  onChallenge?: (word: string, points: number) => void;
  currentPlayerName?: string;
  opponentName?: string;
}

export function WordResultsDisplay({ 
  results, 
  onContinue,
  challengeMode = false,
  onChallenge,
  currentPlayerName = 'Player',
  opponentName = 'Opponent',
}: WordResultsDisplayProps) {
  const [challengedWords, setChallengedWords] = useState<Set<string>>(new Set());
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const hasValidWords = results.some(r => r.isValid);

  const handleChallenge = (word: string, points: number) => {
    setChallengedWords(prev => new Set([...prev, word]));
    onChallenge?.(word, points);
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-end justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md glass-card overflow-hidden animate-slide-up">
        {/* Header */}
        <div 
          className={cn(
            'p-5 text-center',
            hasValidWords ? 'bg-cell-valid' : 'bg-cell-invalid'
          )}
          style={{
            boxShadow: hasValidWords 
              ? '0 0 30px hsl(142 70% 45% / 0.4)' 
              : '0 0 30px hsl(0 70% 55% / 0.4)',
          }}
        >
          <h3 className="font-display font-bold text-2xl text-white flex items-center justify-center gap-2">
            {hasValidWords ? (
              <>
                <Sparkles className="w-6 h-6" />
                Words Found!
                <Sparkles className="w-6 h-6" />
              </>
            ) : (
              <>
                <X className="w-6 h-6" />
                No Valid Words
              </>
            )}
          </h3>
        </div>

        {/* Results list */}
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className={cn(
                'p-4 rounded-xl transition-all animate-slide-in-right',
                result.isValid 
                  ? 'bg-cell-valid/15 border border-cell-valid/40'
                  : 'bg-cell-invalid/15 border border-cell-invalid/40'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-xl text-foreground uppercase tracking-wide flex items-center gap-2">
                  {result.isValid && <Check className="w-5 h-5 text-cell-valid" />}
                  {!result.isValid && <X className="w-5 h-5 text-cell-invalid" />}
                  {result.word}
                </span>
                <span 
                  className={cn(
                    'font-display font-bold text-2xl',
                    result.isValid ? 'text-cell-valid' : 'text-cell-invalid'
                  )}
                  style={result.isValid ? { textShadow: '0 0 10px hsl(142 70% 45% / 0.5)' } : {}}
                >
                  {result.isValid ? `+${result.points}` : '0'}
                </span>
              </div>
              
              {/* Challenge button - PROMINENT version, only in challenge mode */}
              {challengeMode && result.isValid && result.points > 0 && !challengedWords.has(result.word) && (
                <Button
                  onClick={() => handleChallenge(result.word, result.points)}
                  className="w-full mt-3 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-display font-bold text-base animate-pulse"
                  style={{
                    boxShadow: '0 0 20px hsl(25 95% 53% / 0.5), 0 4px 15px hsl(0 0% 0% / 0.3)',
                  }}
                >
                  <Swords className="w-5 h-5 mr-2" />
                  Challenge This Word!
                </Button>
              )}
              
              {/* Definition - only show if NOT in challenge mode */}
              {!challengeMode && result.definition && (
                <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg p-2">
                  <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                  <p className="line-clamp-2">{result.definition}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total and continue */}
        <div className="p-5 border-t border-border/30 bg-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-semibold text-lg text-foreground">Total Points</span>
            <span 
              className="font-display font-bold text-3xl text-primary"
              style={{ textShadow: '0 0 15px hsl(var(--primary) / 0.5)' }}
            >
              +{totalPoints}
            </span>
          </div>
          
          {challengeMode && hasValidWords && (
            <div className="mb-4 p-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-center">
              <p className="text-sm text-orange-200 flex items-center justify-center gap-2">
                <Swords className="w-4 h-4" />
                <span><strong>{opponentName}</strong>, do you want to challenge {currentPlayerName}?</span>
              </p>
              <p className="text-xs text-orange-300/70 mt-1">
                Click "Challenge This Word!" to test if they know the meaning
              </p>
            </div>
          )}
          
          <Button
            onClick={onContinue}
            className="w-full h-14 game-button game-button-primary text-lg"
          >
            Next Turn
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
