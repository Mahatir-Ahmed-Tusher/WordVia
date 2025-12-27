import { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '@/context/GameContext';
import { GameCell } from './GameCell';
import { PlayerPanel } from './PlayerPanel';
import { HomeButton } from './HomeButton';
import { LetterInput } from './LetterInput';
import { WordResultsDisplay } from './WordResultsDisplay';
import { ChallengeModal } from './ChallengeModal';
import { WordSelectionModal } from './WordSelectionModal';
import { DictionaryModal } from './DictionaryModal';
import { validateMoveWithDisambiguation, validateWord, getRestrictionMessage, WordRestriction } from '@/utils/wordValidation';
import { botTurn } from '@/utils/botAI';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SkipForward, Flag, AlertTriangle, Bot } from 'lucide-react';
const wordviaLogo = '/wordvia-logo.png';
const playersTurnIcon = '/players-turn.png';
const dictionaryButton = '/dictionary-button.png';

export function GameBoard() {
  const { state, dispatch } = useGame();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [challengeData, setChallengeData] = useState<{
    word: string;
    points: number;
    challengerIndex: number;
  } | null>(null);
  const [disambiguationData, setDisambiguationData] = useState<{
    direction: 'horizontal' | 'vertical';
    options: { word: string; isValid: boolean; definition?: string }[];
    placedRow: number;
    placedCol: number;
    tempGrid: typeof state.grid;
  } | null>(null);
  const [restrictionPopup, setRestrictionPopup] = useState<{
    word: string;
    restriction: WordRestriction;
  } | null>(null);
  const [usedWordPopup, setUsedWordPopup] = useState<string | null>(null);
  const [showDictionary, setShowDictionary] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botTurnProcessed = useRef(false);

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Bot turn handler
  useEffect(() => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    // Don't run bot handler if challenge is active or just resolved
    if (!currentPlayer?.isBot || showResults || isValidating || isBotThinking || botTurnProcessed.current || challengeData) return;

    botTurnProcessed.current = true;
    setIsBotThinking(true);

    const executeBotTurn = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Brief thinking delay
      
      const { move, shouldPass } = await botTurn(state.grid, state.usedWords, state.botDifficulty);
      
      if (shouldPass || !move) {
        toast({
          title: "Turn Passed",
          description: "Wordvia Bot couldn't find a valid move and passed the turn.",
        });
        dispatch({ type: 'PASS_TURN' });
        setIsBotThinking(false);
        botTurnProcessed.current = false;
        return;
      }

      // Create the updated grid with bot's move
      const tempGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) =>
          ri === move.row && ci === move.col
            ? { ...cell, letter: move.letter.toUpperCase() }
            : cell
        )
      );

      // Validate the ACTUAL words formed using the same validation as human players
      const { results, disambiguation } = await validateMoveWithDisambiguation(tempGrid, move.row, move.col);
      
      let finalResults = results;
      
      // Handle disambiguation - bot picks the best valid subword
      if (disambiguation && disambiguation.options.length > 0) {
        const validOptions = disambiguation.options.filter(
          opt => opt.isValid && !state.usedWords.has(opt.word.toUpperCase())
        );
        
        if (validOptions.length > 0) {
          // Bot picks the longest valid word (highest score)
          const bestOption = validOptions.reduce((best, opt) => 
            opt.word.length > best.word.length ? opt : best
          );
          
          finalResults = [{
            word: bestOption.word,
            isValid: true,
            points: bestOption.word.length,
            definition: bestOption.definition,
            cells: [],
          }];
        }
      }
      
      // Filter out used words and check each word is actually valid
      const validResults = finalResults.filter(r => 
        r.isValid && !state.usedWords.has(r.word.toUpperCase())
      );

      // If no valid words formed, pass instead
      if (validResults.length === 0) {
        toast({
          title: "Turn Passed",
          description: "Wordvia Bot couldn't find a valid move and passed the turn.",
        });
        dispatch({ type: 'PASS_TURN' });
        setIsBotThinking(false);
        botTurnProcessed.current = false;
        return;
      }

      // Place the letter and score
      dispatch({ type: 'BOT_MOVE', row: move.row, col: move.col, letter: move.letter });
      dispatch({ type: 'VALIDATE_WORDS', results: validResults });
      
      setIsBotThinking(false);
      setShowResults(true);
      botTurnProcessed.current = false;
    };

    executeBotTurn();
  }, [state.currentPlayerIndex, state.players, showResults, isValidating, isBotThinking, state.grid, state.usedWords, state.botDifficulty, challengeData, dispatch]);

  // Reset bot turn flag when player changes
  useEffect(() => {
    botTurnProcessed.current = false;
  }, [state.currentPlayerIndex]);

  // Check if grid is full and auto-end game
  useEffect(() => {
    if (state.gamePhase !== 'playing') return;
    
    const isGridFull = state.grid.every(row => 
      row.every(cell => cell.letter !== '')
    );
    
    if (isGridFull) {
      // Small delay to show the last move before ending
      const timer = setTimeout(() => {
        dispatch({ type: 'END_GAME' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.grid, state.gamePhase, dispatch]);

  // Calculate cell size based on screen width
  const getCellSize = () => {
    const padding = 32;
    const gap = (state.gridSize - 1) * 4;
    const availableWidth = Math.min(window.innerWidth - padding, 480);
    return Math.floor((availableWidth - gap) / state.gridSize);
  };

  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    const handleResize = () => setCellSize(getCellSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.gridSize]);

  const handleCellSelect = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, [dispatch]);

  const handleLetterSubmit = async (letter: string) => {
    // Store selected cell before dispatching
    const selectedRow = state.selectedCell?.row;
    const selectedCol = state.selectedCell?.col;
    
    if (selectedRow === undefined || selectedCol === undefined) return;
    
    dispatch({ type: 'PLACE_LETTER', letter });
    
    // Create updated grid for validation
    const tempGrid = state.grid.map((r, ri) =>
      r.map((cell, ci) => 
        ri === selectedRow && ci === selectedCol 
          ? { ...cell, letter: letter.toUpperCase() }
          : cell
      )
    );

    setIsValidating(true);
    try {
      const { results, disambiguation } = await validateMoveWithDisambiguation(tempGrid, selectedRow, selectedCol);
      
      // Check for used words in results
      const usedWordInResults = results.find(r => r.isValid && state.usedWords.has(r.word.toUpperCase()));
      if (usedWordInResults) {
        setUsedWordPopup(usedWordInResults.word);
        setIsValidating(false);
        // Revert the letter placement
        dispatch({ type: 'CLEAR_SELECTION' });
        return;
      }
      
      // Check if disambiguation is needed
      if (disambiguation) {
        // Filter out already used words from disambiguation options
        const filteredOptions = disambiguation.options.map(opt => ({
          ...opt,
          isValid: opt.isValid && !state.usedWords.has(opt.word.toUpperCase()),
        }));
        
        setDisambiguationData({
          direction: disambiguation.direction,
          options: filteredOptions,
          placedRow: selectedRow,
          placedCol: selectedCol,
          tempGrid,
        });
        setIsValidating(false);
        return;
      }
      
      dispatch({ type: 'VALIDATE_WORDS', results });
      
      // If there are results to show, display them; otherwise go directly to next turn
      if (results.length > 0) {
        setShowResults(true);
      } else {
        // No words formed (single letter isolated), just go to next turn
        dispatch({ type: 'NEXT_TURN' });
      }
    } catch (error) {
      console.error('Validation error:', error);
      // On error, just proceed to next turn
      dispatch({ type: 'NEXT_TURN' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleWordSelection = async (selectedWord: string) => {
    if (!disambiguationData) return;

    // Check if word has already been used
    if (state.usedWords.has(selectedWord.toUpperCase())) {
      setUsedWordPopup(selectedWord);
      return; // Don't close disambiguation, let them pick another
    }

    const validation = await validateWord(selectedWord);
    
    // Check if word has a restriction (past tense, plural, etc.)
    if (validation.restriction) {
      setRestrictionPopup({
        word: selectedWord,
        restriction: validation.restriction,
      });
      return; // Don't close disambiguation, let them pick another
    }
    
    const results = [{
      word: selectedWord,
      isValid: validation.isValid,
      points: validation.isValid ? selectedWord.length : 0,
      definition: validation.definition,
      cells: [], // Cells not needed for display
    }];
    
    dispatch({ type: 'VALIDATE_WORDS', results });
    setDisambiguationData(null);
    setShowResults(true);
  };
  
  const handleCloseRestrictionPopup = () => {
    setRestrictionPopup(null);
  };

  const handleCloseUsedWordPopup = () => {
    setUsedWordPopup(null);
  };

  const handleCancelDisambiguation = () => {
    // Revert the placed letter by clearing selection and going to next turn without points
    setDisambiguationData(null);
    dispatch({ type: 'NEXT_TURN' });
  };

  const handleNextTurn = () => {
    setShowResults(false);
    dispatch({ type: 'NEXT_TURN' });
  };

  const handlePass = () => {
    const currentPlayer = state.players[state.currentPlayerIndex];
    toast({
      title: "Turn Passed",
      description: `${currentPlayer?.name || 'Player'} decided to skip this turn.`,
    });
    dispatch({ type: 'PASS_TURN' });
  };

  const handleEndGame = () => {
    dispatch({ type: 'END_GAME' });
  };

  const handleCancelSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const handleChallenge = (word: string, points: number) => {
    // The next player is the challenger
    const challengerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    setChallengeData({ word, points, challengerIndex });
    setShowResults(false);
  };

  const handleChallengeResult = (isCorrect: boolean) => {
    if (!isCorrect && challengeData) {
      // Revoke the points from the current player
      dispatch({ type: 'REVOKE_POINTS', points: challengeData.points });
    }
    setShowResults(false); // Reset showResults so UI is in correct state
    setChallengeData(null); // Clear challenge data first
    // Use setTimeout to ensure state updates before NEXT_TURN, preventing bot from playing twice
    setTimeout(() => {
      dispatch({ type: 'NEXT_TURN' });
    }, 0);
  };

  const handleCancelChallenge = () => {
    setChallengeData(null);
    setShowResults(true);
  };

  const currentPlayer = state.players[state.currentPlayerIndex];

  if (!currentPlayer) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col relative overflow-hidden transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
      {/* Home button */}
      <HomeButton />
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-accent/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Header with glowing logo */}
      <div className="relative z-10 p-3 flex items-center justify-center animate-slide-up">
        <div className="relative">
          <div 
            className="absolute inset-0 blur-xl animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
              transform: 'scale(2)',
            }}
          />
          <img 
            src={wordviaLogo} 
            alt="Wordvia" 
            className="relative w-20 h-20 object-contain"
            style={{
              filter: 'drop-shadow(0 0 15px hsl(var(--primary) / 0.6))',
            }}
          />
        </div>
      </div>

      {/* Player panels */}
      <div className="relative z-10 px-4 mb-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col gap-1 max-w-sm mx-auto">
          {state.players.map((player, index) => (
            <PlayerPanel
              key={player.id}
              player={player}
              playerIndex={index}
              isActive={index === state.currentPlayerIndex}
            />
          ))}
        </div>
      </div>

      {/* Current turn indicator */}
      <div 
        key={state.currentPlayerIndex}
        className="relative z-10 mx-auto mb-4 py-1.5 px-4 rounded-full font-display font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 animate-scale-bounce"
        style={{ 
          backgroundColor: currentPlayer.color,
          color: currentPlayer.color.includes('45,') ? 'hsl(270, 55%, 12%)' : 'white',
        }}
      >
        <img 
          src={playersTurnIcon} 
          alt="" 
          className="w-4 h-4 object-contain animate-spin-once"
        />
        <span>{currentPlayer.name}'s Turn</span>
      </div>

      {/* Game grid with glow */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div 
          className="grid gap-1 p-4 glass-card"
          style={{ 
            gridTemplateColumns: `repeat(${state.gridSize}, 1fr)`,
            boxShadow: '0 0 40px hsl(var(--primary) / 0.15), 0 8px 32px hsl(0 0% 0% / 0.2)',
          }}
        >
          {state.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <GameCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                isSelected={
                  state.selectedCell?.row === rowIndex && 
                  state.selectedCell?.col === colIndex
                }
                cellSize={cellSize}
                onSelect={handleCellSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Word results display - only show if we have results */}
      {showResults && state.lastWordResults.length > 0 && (
        <WordResultsDisplay 
          results={state.lastWordResults} 
          onContinue={handleNextTurn}
          challengeMode={state.challengeMode}
          onChallenge={handleChallenge}
          currentPlayerName={currentPlayer.name}
          opponentName={state.players[(state.currentPlayerIndex + 1) % state.players.length]?.name || 'Opponent'}
        />
      )}

      {/* Challenge modal */}
      {challengeData && (
        <ChallengeModal
          word={challengeData.word}
          points={challengeData.points}
          challengerName={state.players[challengeData.challengerIndex]?.name || 'Opponent'}
          defenderName={currentPlayer.name}
          defenderColor={currentPlayer.color}
          isDefenderBot={currentPlayer.isBot}
          onResult={handleChallengeResult}
          onCancel={handleCancelChallenge}
        />
      )}

      {/* Word selection modal for disambiguation */}
      {disambiguationData && (
        <WordSelectionModal
          direction={disambiguationData.direction}
          options={disambiguationData.options}
          onSelect={handleWordSelection}
          onCancel={handleCancelDisambiguation}
          playerColor={currentPlayer.color}
      />
      )}

      {/* Restriction popup */}
      {restrictionPopup && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="glass-card p-6 max-w-sm w-full animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Word Not Allowed
            </h3>
            <p className="text-lg font-bold text-primary mb-2">
              {restrictionPopup.word.toUpperCase()}
            </p>
            <p className="text-muted-foreground mb-6">
              {getRestrictionMessage(restrictionPopup.restriction)}
            </p>
            <Button
              onClick={handleCloseRestrictionPopup}
              className="w-full game-button"
            >
              Try Another Word
            </Button>
          </div>
        </div>
      )}

      {/* Used word popup */}
      {usedWordPopup && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="glass-card p-6 max-w-sm w-full animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Word Already Used
            </h3>
            <p className="text-lg font-bold text-primary mb-2">
              {usedWordPopup.toUpperCase()}
            </p>
            <p className="text-muted-foreground mb-6">
              This word has already been played in this game. Try a different word!
            </p>
            <Button
              onClick={handleCloseUsedWordPopup}
              className="w-full game-button"
            >
              Try Another Word
            </Button>
          </div>
        </div>
      )}

      {state.selectedCell && !showResults && !isValidating && !disambiguationData && (
        <LetterInput
          onSubmit={handleLetterSubmit}
          onCancel={handleCancelSelection}
          isValidating={isValidating}
          playerColor={currentPlayer.color}
        />
      )}

      {/* Loading indicator during validation */}
      {isValidating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground font-display">Checking word...</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!state.selectedCell && !showResults && !isValidating && (
        <div className="relative z-10 p-4 flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex gap-3">
            <Button
              onClick={handlePass}
              variant="secondary"
              className="flex-1 game-button game-button-secondary h-14 text-base"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Pass Turn
            </Button>
            <Button
              onClick={handleEndGame}
              variant="destructive"
              className="flex-1 game-button h-14 text-base"
              style={{
                boxShadow: '0 0 20px hsl(var(--destructive) / 0.3)',
              }}
            >
              <Flag className="w-5 h-5 mr-2" />
              End Game
            </Button>
          </div>
          
          {/* Dictionary button */}
          <button
            onClick={() => setShowDictionary(true)}
            className="w-full flex items-center justify-center"
          >
            <img 
              src={dictionaryButton} 
              alt="Dictionary" 
              className="h-14 object-contain hover:scale-105 transition-transform"
            />
          </button>
        </div>
      )}

      {/* Dictionary modal */}
      {showDictionary && (
        <DictionaryModal onClose={() => setShowDictionary(false)} />
      )}
    </div>
  );
}
