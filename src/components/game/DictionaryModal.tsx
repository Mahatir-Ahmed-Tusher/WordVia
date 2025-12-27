import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Volume2 } from 'lucide-react';

interface DictionaryModalProps {
  onClose: () => void;
}

interface DictionaryResult {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export function DictionaryModal({ onClose }: DictionaryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm.trim().toLowerCase()}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Word not found. Please check the spelling.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        return;
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setResult(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch definition. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl.startsWith('//') ? `https:${audioUrl}` : audioUrl);
      audio.play();
    }
  };

  const audioUrl = result?.phonetics?.find(p => p.audio)?.audio;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="glass-card p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">Dictionary</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a word..."
            className="flex-1"
            autoFocus
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !searchTerm.trim()}
            className="game-button px-4"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Word header */}
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl font-bold text-primary">
                  {result.word}
                </h3>
                {audioUrl && (
                  <button
                    onClick={() => playAudio(audioUrl)}
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-primary" />
                  </button>
                )}
              </div>

              {result.phonetic && (
                <p className="text-muted-foreground italic">{result.phonetic}</p>
              )}

              {/* Meanings */}
              {result.meanings.map((meaning, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="inline-block px-2 py-1 rounded-md bg-primary/20 text-primary text-sm font-medium">
                    {meaning.partOfSpeech}
                  </span>
                  <ol className="list-decimal list-inside space-y-2">
                    {meaning.definitions.slice(0, 3).map((def, defIdx) => (
                      <li key={defIdx} className="text-foreground">
                        <span className="text-foreground">{def.definition}</span>
                        {def.example && (
                          <p className="text-muted-foreground text-sm mt-1 ml-5 italic">
                            &quot;{def.example}&quot;
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && !result && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Enter a word to see its definition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
