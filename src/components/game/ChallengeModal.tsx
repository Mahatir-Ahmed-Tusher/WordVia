import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { verifyMeaning } from '@/utils/groqApi';
import { validateWord, getWordDefinition } from '@/utils/wordValidation';
import { Loader2, Send, X, Swords, CheckCircle2, XCircle, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeModalProps {
  word: string;
  points: number;
  challengerName: string;
  defenderName: string;
  defenderColor: string;
  isDefenderBot?: boolean;
  onResult: (isCorrect: boolean) => void;
  onCancel: () => void;
}

export function ChallengeModal({
  word,
  points,
  challengerName,
  defenderName,
  defenderColor,
  isDefenderBot = false,
  onResult,
  onCancel,
}: ChallengeModalProps) {
  const [meaning, setMeaning] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFetchingMeaning, setIsFetchingMeaning] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleSubmit = useCallback(async (providedMeaning?: string) => {
    const meaningToSubmit = providedMeaning || meaning;
    if (!meaningToSubmit.trim() || isVerifying) return;
    
    setIsVerifying(true);
    try {
      console.log('Verifying meaning for word:', word, 'meaning:', meaningToSubmit);
      const isCorrect = await verifyMeaning(word, meaningToSubmit);
      console.log('Verification result:', isCorrect);
      setIsVerifying(false);
      setResult(isCorrect ? 'correct' : 'wrong');
      
      // Show result for a moment before proceeding
      setTimeout(() => {
        onResult(isCorrect);
      }, 2000);
    } catch (error) {
      console.error('Challenge verification error:', error);
      setIsVerifying(false);
      // On error, give benefit of doubt
      setResult('correct');
      setTimeout(() => {
        onResult(true);
      }, 2000);
    }
  }, [word, onResult]);

  // Auto-fetch meaning for bot defenders
  // Bot has access to both COMMON_WORD_DEFINITIONS (first priority) and API (fallback)
  useEffect(() => {
    if (isDefenderBot && !meaning && !isVerifying && !result && !isFetchingMeaning) {
      console.log('[ChallengeModal] Bot defender detected, fetching meaning for word:', word);
      setIsFetchingMeaning(true);
      
      // First: Try to get definition using getWordDefinition (prioritizes COMMON_WORD_DEFINITIONS, then API)
      getWordDefinition(word)
        .then((definition) => {
          if (definition) {
            console.log('[ChallengeModal] Bot meaning fetched from lexical resources/API:', definition);
            setMeaning(definition);
            setIsFetchingMeaning(false);
            // Auto-submit after a short delay to show the meaning
            setTimeout(() => {
              handleSubmit(definition);
            }, 1500);
          } else {
            // If getWordDefinition returns null, try validateWord as final fallback
            console.log('[ChallengeModal] getWordDefinition returned null, trying validateWord as fallback');
            return validateWord(word).then((validationResult) => {
              if (validationResult.isValid && validationResult.definition) {
                const botMeaning = validationResult.definition;
                console.log('[ChallengeModal] Bot meaning fetched from validateWord:', botMeaning);
                setMeaning(botMeaning);
                setIsFetchingMeaning(false);
                setTimeout(() => {
                  handleSubmit(botMeaning);
                }, 1500);
              } else {
                // If no definition found, use a fallback
                const fallbackMeaning = 'A valid English word';
                console.log('[ChallengeModal] No definition found, using fallback');
                setMeaning(fallbackMeaning);
                setIsFetchingMeaning(false);
                setTimeout(() => {
                  handleSubmit(fallbackMeaning);
                }, 1500);
              }
            });
          }
        })
        .catch((error) => {
          console.error('[ChallengeModal] Error fetching word definition for bot:', error);
          const fallbackMeaning = 'A valid English word';
          setMeaning(fallbackMeaning);
          setIsFetchingMeaning(false);
          setTimeout(() => {
            handleSubmit(fallbackMeaning);
          }, 1500);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefenderBot, word]);

  if (result) {
    return (
      <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className={cn(
          'w-full max-w-md glass-card p-8 text-center animate-scale-bounce',
          result === 'correct' ? 'border-cell-valid' : 'border-cell-invalid'
        )}>
          {result === 'correct' ? (
            <>
              <CheckCircle2 className="w-20 h-20 mx-auto text-cell-valid mb-4" />
              <h2 className="font-display font-bold text-2xl text-cell-valid mb-2">
                Correct!
              </h2>
              <p className="text-muted-foreground">
                {defenderName} keeps the <span className="text-primary font-bold">+{points}</span> points!
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-20 h-20 mx-auto text-cell-invalid mb-4" />
              <h2 className="font-display font-bold text-2xl text-cell-invalid mb-2">
                Wrong!
              </h2>
              <p className="text-muted-foreground">
                {defenderName} loses the <span className="text-cell-invalid font-bold">{points}</span> points!
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-md glass-card overflow-hidden animate-slide-up">
        {/* Header */}
        <div 
          className="p-5 text-center bg-gradient-to-r from-accent/30 to-primary/30"
          style={{ boxShadow: '0 0 30px hsl(var(--accent) / 0.3)' }}
        >
          <Swords className="w-10 h-10 mx-auto text-accent-foreground mb-2" />
          <h3 className="font-display font-bold text-2xl text-foreground">
            Challenge!
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {challengerName} challenges the word!
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">
              <span style={{ color: defenderColor }} className="font-semibold">{defenderName}</span>
              {isDefenderBot ? ' is providing the meaning of:' : ', write the meaning of:'}
            </p>
            <div 
              className="inline-block px-6 py-3 rounded-xl bg-primary/20 font-display font-bold text-3xl text-primary uppercase tracking-widest"
              style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' }}
            >
              {word}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Worth <span className="text-primary font-bold">+{points}</span> points
            </p>
            {isDefenderBot && (
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Bot className="w-4 h-4" />
                <span>Bot is fetching meaning from dictionary...</span>
              </div>
            )}
          </div>

          <Textarea
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder={isDefenderBot ? "Bot is fetching meaning..." : "Type the meaning of the word (English or Bengali)..."}
            className="min-h-[100px] bg-white text-gray-900 border-border/30 focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
            disabled={isVerifying || isDefenderBot || isFetchingMeaning}
          />

          <p className="text-xs text-muted-foreground text-center">
            AI will verify if your meaning is correct (English or Bengali accepted)
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-border/30 bg-secondary/20 flex gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1 h-12 game-button game-button-secondary"
            disabled={isVerifying}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={!meaning.trim() || isVerifying}
            className="flex-1 h-12 game-button game-button-primary"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
