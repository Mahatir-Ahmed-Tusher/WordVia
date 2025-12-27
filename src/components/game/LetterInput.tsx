import { useState, useEffect, useRef, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Loader2 } from 'lucide-react';

interface LetterInputProps {
  onSubmit: (letter: string) => void;
  onCancel: () => void;
  isValidating: boolean;
  playerColor: string;
}

export const LetterInput = forwardRef<HTMLDivElement, LetterInputProps>(
  function LetterInput({ onSubmit, onCancel, isValidating, playerColor }, ref) {
    const [letter, setLetter] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase();
      if (/^[A-Z]?$/.test(value)) {
        setLetter(value);
      }
    };

    const handleSubmit = () => {
      if (letter && !isValidating) {
        onSubmit(letter);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && letter) {
        handleSubmit();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    return (
      <div ref={ref} className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-end justify-center p-4 z-50 animate-fade-in">
        <div className="w-full max-w-md glass-card p-6 animate-slide-up">
          <h3 className="text-center font-display font-bold text-xl mb-5 text-foreground">
            Enter a Letter
          </h3>

          <div className="flex justify-center mb-4">
            <div 
              className="w-20 h-20 rounded-xl shadow-2xl flex items-center justify-center border-4 transition-all duration-200 bg-card"
              style={{ 
                borderColor: playerColor,
                boxShadow: `0 0 40px ${playerColor}50, 0 10px 40px -10px ${playerColor}40`,
              }}
            >
              <Input
                ref={inputRef}
                value={letter}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={1}
                className="w-full h-full text-4xl font-display font-bold text-center bg-transparent border-none focus:ring-0 text-card-foreground uppercase"
                disabled={isValidating}
              />
            </div>
          </div>

          {/* Place Letter button directly under the input */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleSubmit}
              disabled={!letter || isValidating}
              className="h-14 px-8 game-button game-button-primary text-base"
            >
              {isValidating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Place Letter
                </>
              )}
            </Button>
          </div>

          {/* Quick letter buttons for mobile */}
          <div className="grid grid-cols-7 gap-1.5 mb-6">
            {['A', 'E', 'I', 'O', 'U', 'S', 'T', 'R', 'N', 'L', 'C', 'D', 'H', 'M'].map((l) => (
              <button
                key={l}
                onClick={() => setLetter(l)}
                disabled={isValidating}
                className="w-full aspect-square bg-secondary hover:bg-accent text-secondary-foreground rounded-xl font-display font-bold text-lg transition-all active:scale-90 disabled:opacity-50 hover:shadow-lg"
                style={{
                  boxShadow: letter === l ? `0 0 15px ${playerColor}50` : undefined,
                  backgroundColor: letter === l ? playerColor : undefined,
                  color: letter === l ? (playerColor.includes('45,') ? 'hsl(270, 55%, 12%)' : 'white') : undefined,
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full h-14 text-base font-display"
            disabled={isValidating}
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }
);
