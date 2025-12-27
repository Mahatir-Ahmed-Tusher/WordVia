import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Circle } from 'lucide-react';

interface WordOption {
  word: string;
  isValid: boolean;
  definition?: string;
}

interface WordSelectionModalProps {
  direction: 'horizontal' | 'vertical';
  options: WordOption[];
  onSelect: (word: string) => void;
  onCancel: () => void;
  playerColor: string;
}

export function WordSelectionModal({
  direction,
  options,
  onSelect,
  onCancel,
  playerColor,
}: WordSelectionModalProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedWord) {
      onSelect(selectedWord);
    }
  };

  // Check if there's at least one valid option (for internal logic only)
  const hasValidOptions = options.some(opt => opt.isValid);

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="glass-card p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-scale-in"
        style={{
          boxShadow: `0 0 40px ${playerColor}30`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">
            Which word did you mean?
          </h2>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          Your {direction} placement forms multiple possible words. Select the word you intended:
        </p>

        <div className="space-y-2 mb-6">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedWord(option.word)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedWord === option.word
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Circle className={`w-5 h-5 ${
                  selectedWord === option.word ? 'text-primary fill-primary' : 'text-muted-foreground'
                }`} />
                <span className="font-display font-bold text-lg text-foreground">
                  {option.word.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1 game-button game-button-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedWord}
            className="flex-1 game-button"
            style={{
              background: selectedWord ? playerColor : undefined,
              boxShadow: selectedWord ? `0 0 20px ${playerColor}40` : undefined,
            }}
          >
            Confirm Word
          </Button>
        </div>
      </div>
    </div>
  );
}
