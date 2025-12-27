"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  GameState, 
  Player, 
  WordResult, 
  TurnAction,
  createGrid, 
  PLAYER_COLORS,
  BOT_COLOR,
  GameMode,
  BotDifficulty
} from '@/types/game';

// Storage key for localStorage
const STORAGE_KEY = 'wordvia_game_state';

// Initial game state
const initialState: GameState = {
  players: [],
  grid: [],
  gridSize: 5,
  currentPlayerIndex: 0,
  selectedCell: null,
  lastWordResults: [],
  gamePhase: 'splash',
  winner: null,
  turnHistory: [],
  challengeMode: false,
  usedWords: new Set<string>(),
  gameMode: 'pvp',
  botDifficulty: 'medium',
};

// Action types
type GameAction =
  | { type: 'SET_PHASE'; phase: GameState['gamePhase'] }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SETUP_GAME'; players: string[]; gridSize: number; challengeMode: boolean; gameMode: GameMode; botDifficulty: BotDifficulty; botPlayerIndex?: number }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'PLACE_LETTER'; letter: string }
  | { type: 'VALIDATE_WORDS'; results: WordResult[] }
  | { type: 'NEXT_TURN' }
  | { type: 'PASS_TURN' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'REVOKE_POINTS'; points: number }
  | { type: 'BOT_MOVE'; row: number; col: number; letter: string };

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, gamePhase: action.phase };

    case 'SET_MODE':
      return { ...state, gameMode: action.mode };

    case 'SETUP_GAME': {
      const players: Player[] = action.players.map((name, index) => ({
        id: `player-${index}`,
        name,
        score: 0,
        color: action.botPlayerIndex === index ? BOT_COLOR : PLAYER_COLORS[index % PLAYER_COLORS.length],
        isBot: action.botPlayerIndex === index,
      }));
      return {
        ...state,
        players,
        grid: createGrid(action.gridSize),
        gridSize: action.gridSize,
        currentPlayerIndex: 0,
        selectedCell: null,
        lastWordResults: [],
        gamePhase: 'playing',
        winner: null,
        turnHistory: [],
        challengeMode: action.challengeMode,
        usedWords: new Set<string>(),
        gameMode: action.gameMode,
        botDifficulty: action.botDifficulty,
      };
    }

    case 'BOT_MOVE': {
      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) => {
          if (cell.isNew) {
            return { ...cell, isNew: false, isValid: null };
          }
          if (ri === action.row && ci === action.col) {
            return {
              ...cell,
              letter: action.letter.toUpperCase(),
              playerId: state.players[state.currentPlayerIndex]?.id || null,
              isNew: true,
            };
          }
          return cell;
        })
      );
      return { ...state, grid: newGrid, selectedCell: null };
    }

    case 'SELECT_CELL':
      if (!state.grid[action.row] || !state.grid[action.row][action.col]) {
        return state;
      }
      if (state.grid[action.row][action.col].letter !== '') {
        return state;
      }
      return { ...state, selectedCell: { row: action.row, col: action.col } };

    case 'CLEAR_SELECTION':
      return { ...state, selectedCell: null };

    case 'PLACE_LETTER': {
      if (!state.selectedCell) return state;
      const { row, col } = state.selectedCell;
      const newGrid = state.grid.map((r, ri) =>
        r.map((cell, ci) => {
          if (cell.isNew) {
            return { ...cell, isNew: false, isValid: null };
          }
          if (ri === row && ci === col) {
            return {
              ...cell,
              letter: action.letter.toUpperCase(),
              playerId: state.players[state.currentPlayerIndex]?.id || null,
              isNew: true,
            };
          }
          return cell;
        })
      );
      return { ...state, grid: newGrid, selectedCell: null };
    }

    case 'VALIDATE_WORDS': {
      const newGrid = state.grid.map(row =>
        row.map(cell => ({ ...cell, isPartOfWord: false, isValid: null }))
      );
      
      action.results.forEach(result => {
        result.cells.forEach(({ row, col }) => {
          if (newGrid[row] && newGrid[row][col]) {
            newGrid[row][col].isPartOfWord = true;
            newGrid[row][col].isValid = result.isValid;
          }
        });
      });

      const points = action.results.reduce((sum, r) => sum + r.points, 0);
      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
          ? { ...p, score: p.score + points }
          : p
      );

      const turnAction: TurnAction = {
        playerId: state.players[state.currentPlayerIndex]?.id || 'unknown',
        type: 'place',
        wordsFormed: action.results,
        timestamp: Date.now(),
      };

      // Add valid words to the usedWords set
      const newUsedWords = new Set(state.usedWords);
      action.results.forEach(result => {
        if (result.isValid) {
          newUsedWords.add(result.word.toUpperCase());
        }
      });

      return {
        ...state,
        grid: newGrid,
        players: updatedPlayers,
        lastWordResults: action.results,
        turnHistory: [...state.turnHistory, turnAction],
        usedWords: newUsedWords,
      };
    }

    case 'NEXT_TURN': {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const clearedGrid = state.grid.map(row =>
        row.map(cell => ({
          ...cell,
          isNew: false,
          isPartOfWord: false,
          isValid: null,
        }))
      );
      return {
        ...state,
        grid: clearedGrid,
        currentPlayerIndex: nextIndex,
        lastWordResults: [],
      };
    }

    case 'PASS_TURN': {
      const turnAction: TurnAction = {
        playerId: state.players[state.currentPlayerIndex]?.id || 'unknown',
        type: 'pass',
        timestamp: Date.now(),
      };
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        turnHistory: [...state.turnHistory, turnAction],
        lastWordResults: [],
      };
    }

    case 'END_GAME': {
      if (state.players.length === 0) {
        return { ...state, gamePhase: 'ended', winner: null };
      }
      const winner = state.players.reduce((max, p) =>
        p.score > max.score ? p : max
      );
      return { ...state, gamePhase: 'ended', winner };
    }

    case 'RESET_GAME':
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to clear localStorage');
      }
      return { ...initialState, gamePhase: 'splash', usedWords: new Set<string>() };

    case 'REVOKE_POINTS': {
      const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
          ? { ...p, score: Math.max(0, p.score - action.points) }
          : p
      );
      return { ...state, players: updatedPlayers };
    }

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// Create context with default value
const GameContext = createContext<GameContextType | null>(null);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gamePhase === 'playing' || parsed.gamePhase === 'ended') {
          // Convert usedWords array back to Set (handle both array and missing cases)
          const usedWordsArray = Array.isArray(parsed.usedWords) ? parsed.usedWords : [];
          parsed.usedWords = new Set<string>(usedWordsArray);
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      }
    } catch (e) {
      console.error('Failed to load saved game state, clearing corrupted data');
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    if (state.gamePhase !== 'splash') {
      try {
        // Convert Set to array for JSON serialization
        const stateToSave = {
          ...state,
          usedWords: Array.from(state.usedWords),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save game state');
      }
    }
  }, [state]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use game context
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
