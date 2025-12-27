// Core game types for Wordvia

export type GameMode = 'pvp' | 'pvb';
export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
  isBot: boolean;
}

export interface Cell {
  letter: string;
  playerId: string | null;
  isNew: boolean;
  isValid: boolean | null;
  isPartOfWord: boolean;
}

export interface WordResult {
  word: string;
  isValid: boolean;
  points: number;
  definition?: string;
  cells: { row: number; col: number }[];
}

export interface GameState {
  players: Player[];
  grid: Cell[][];
  gridSize: number;
  currentPlayerIndex: number;
  selectedCell: { row: number; col: number } | null;
  lastWordResults: WordResult[];
  gamePhase: 'splash' | 'tour' | 'mode-select' | 'setup' | 'playing' | 'ended';
  winner: Player | null;
  turnHistory: TurnAction[];
  challengeMode: boolean;
  usedWords: Set<string>;
  gameMode: GameMode;
  botDifficulty: BotDifficulty;
}

export interface TurnAction {
  playerId: string;
  type: 'place' | 'pass';
  cell?: { row: number; col: number };
  letter?: string;
  wordsFormed?: WordResult[];
  timestamp: number;
}

export interface DictionaryApiResponse {
  word: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

// Player colors - vibrant palette matching game theme
export const PLAYER_COLORS = [
  'hsl(45, 96%, 55%)',   // Gold
  'hsl(280, 70%, 60%)',  // Purple
  'hsl(160, 70%, 45%)',  // Teal
  'hsl(20, 90%, 55%)',   // Orange
];

// Bot color
export const BOT_COLOR = 'hsl(210, 70%, 50%)'; // Blue

// Initial empty cell
export const createEmptyCell = (): Cell => ({
  letter: '',
  playerId: null,
  isNew: false,
  isValid: null,
  isPartOfWord: false,
});

// Create initial grid
export const createGrid = (size: number): Cell[][] => 
  Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => createEmptyCell())
  );
