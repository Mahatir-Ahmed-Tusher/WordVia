/**
 * Wordvia AI Bot Implementation
 * Rule-Based + Heuristics Bot for turn-based word game
 * 
 * Optimized for speed - responds within 5 seconds
 * Supports disambiguation (e.g., forming DOG when ADO exists)
 */

import { Cell, WordResult } from '@/types/game';
import { validateWord, extractWordsFromGrid, extractSubwordsContainingLetter } from './wordValidation';

// Most common letters for faster move generation
const FREQUENT_LETTERS = ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'C', 'D', 'G'];
const MIN_WORD_LENGTH = 2;
const MAX_CANDIDATES_TO_CHECK = 20;
const MAX_CELLS_TO_CHECK = 25;
const MAX_SUBWORDS_TO_CHECK = 5;

export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CandidateMove {
  row: number;
  col: number;
  letter: string;
  immediateScore: number;
  boardControlScore: number;
  finalScore: number;
  wordsFormed: string[];
}

/**
 * Get cells adjacent to existing letters (prioritized for speed)
 */
function getStrategicCells(grid: Cell[][]): { row: number; col: number }[] {
  const gridSize = grid.length;
  const adjacentCells: { row: number; col: number; priority: number }[] = [];
  const hasLetters = grid.some(row => row.some(cell => cell.letter !== ''));
  
  if (!hasLetters) {
    const center = Math.floor(gridSize / 2);
    return [{ row: center, col: center }];
  }
  
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col].letter !== '') continue;
      
      let adjacentCount = 0;
      for (const [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc].letter !== '') {
          adjacentCount++;
        }
      }
      
      if (adjacentCount > 0) {
        adjacentCells.push({ row, col, priority: adjacentCount });
      }
    }
  }
  
  adjacentCells.sort((a, b) => b.priority - a.priority);
  return adjacentCells.slice(0, MAX_CELLS_TO_CHECK).map(c => ({ row: c.row, col: c.col }));
}

/**
 * Quick check if placing a letter could form a word
 */
function couldFormWord(grid: Cell[][], row: number, col: number): boolean {
  const gridSize = grid.length;
  
  let hStart = col, hEnd = col;
  while (hStart > 0 && grid[row][hStart - 1].letter !== '') hStart--;
  while (hEnd < gridSize - 1 && grid[row][hEnd + 1].letter !== '') hEnd++;
  const hLength = hEnd - hStart + 1;
  
  let vStart = row, vEnd = row;
  while (vStart > 0 && grid[vStart - 1][col].letter !== '') vStart--;
  while (vEnd < gridSize - 1 && grid[vEnd + 1][col].letter !== '') vEnd++;
  const vLength = vEnd - vStart + 1;
  
  return hLength >= MIN_WORD_LENGTH || vLength >= MIN_WORD_LENGTH;
}

/**
 * Create temporary grid with letter placed
 */
function createTempGrid(grid: Cell[][], row: number, col: number, letter: string): Cell[][] {
  return grid.map((r, ri) =>
    r.map((cell, ci) =>
      ri === row && ci === col
        ? { ...cell, letter: letter.toUpperCase() }
        : cell
    )
  );
}

/**
 * Calculate board control score
 */
function calculateBoardControlScore(grid: Cell[][], row: number, col: number): number {
  const gridSize = grid.length;
  const center = Math.floor(gridSize / 2);
  const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
  return distFromCenter <= gridSize / 3 ? 1 : 0;
}

/**
 * Get all possible words (including subwords) for a move
 * This allows the bot to form words like DOG when ADO already exists
 */
function getAllPossibleWords(
  tempGrid: Cell[][],
  row: number,
  col: number
): string[] {
  const allWords: Set<string> = new Set();
  
  // Get full words
  const fullWords = extractWordsFromGrid(tempGrid, row, col);
  fullWords.forEach(w => allWords.add(w.word));
  
  // Get subwords (for disambiguation scenarios like ADO + G = DOG)
  const hSubwords = extractSubwordsContainingLetter(tempGrid, row, col, 'horizontal');
  const vSubwords = extractSubwordsContainingLetter(tempGrid, row, col, 'vertical');
  
  // Add top subwords by length
  hSubwords.slice(0, MAX_SUBWORDS_TO_CHECK).forEach(w => allWords.add(w));
  vSubwords.slice(0, MAX_SUBWORDS_TO_CHECK).forEach(w => allWords.add(w));
  
  return Array.from(allWords);
}

/**
 * Generate candidate moves - considers both full words and subwords
 */
export async function generateCandidateMoves(
  grid: Cell[][],
  usedWords: Set<string>
): Promise<CandidateMove[]> {
  const strategicCells = getStrategicCells(grid);
  const potentialMoves: { row: number; col: number; letter: string; words: string[] }[] = [];
  
  // First pass: find moves that could form words (no API calls)
  for (const { row, col } of strategicCells) {
    for (const letter of FREQUENT_LETTERS) {
      if (!couldFormWord(grid, row, col)) continue;
      
      const tempGrid = createTempGrid(grid, row, col, letter);
      const allWords = getAllPossibleWords(tempGrid, row, col);
      
      // Filter out used words and too short words
      const availableWords = allWords.filter(
        w => w.length >= MIN_WORD_LENGTH && !usedWords.has(w.toUpperCase())
      );
      
      if (availableWords.length > 0) {
        potentialMoves.push({ row, col, letter, words: availableWords });
      }
    }
    
    if (potentialMoves.length >= MAX_CANDIDATES_TO_CHECK * 2) break;
  }
  
  // Second pass: validate only the most promising moves
  const candidates: CandidateMove[] = [];
  const movesToValidate = potentialMoves.slice(0, MAX_CANDIDATES_TO_CHECK);
  
  // Validate in parallel for speed
  const validationPromises = movesToValidate.map(async (move) => {
    const validWords: string[] = [];
    let bestScore = 0;
    
    // Validate each word (limit to avoid too many API calls)
    const wordsToCheck = move.words.slice(0, 6);
    
    for (const word of wordsToCheck) {
      const validation = await validateWord(word);
      if (validation.isValid && !validation.restriction) {
        validWords.push(word);
        // Track the best (longest) word score
        if (word.length > bestScore) {
          bestScore = word.length;
        }
      }
    }
    
    if (validWords.length > 0) {
      return {
        row: move.row,
        col: move.col,
        letter: move.letter,
        immediateScore: bestScore,
        boardControlScore: calculateBoardControlScore(grid, move.row, move.col),
        finalScore: 0,
        wordsFormed: validWords,
      };
    }
    return null;
  });
  
  const results = await Promise.all(validationPromises);
  
  for (const result of results) {
    if (result) candidates.push(result);
  }
  
  return candidates;
}

/**
 * Calculate final score based on difficulty
 */
function evaluateMove(move: CandidateMove, difficulty: BotDifficulty): number {
  switch (difficulty) {
    case 'easy':
      return Math.random() * 10;
    case 'medium':
      return move.immediateScore * 3;
    case 'hard':
    case 'expert':
      return move.immediateScore * 3 + move.boardControlScore * 2;
    default:
      return move.immediateScore * 3;
  }
}

/**
 * Choose best move
 */
export function chooseBestMove(candidates: CandidateMove[], difficulty: BotDifficulty): CandidateMove | null {
  if (candidates.length === 0) return null;
  
  const scored = candidates.map(c => ({ ...c, finalScore: evaluateMove(c, difficulty) }));
  scored.sort((a, b) => b.finalScore - a.finalScore);
  
  // 10% chance to pick from top 3 for variety
  if (scored.length > 1 && Math.random() < 0.1) {
    const top = scored.slice(0, Math.min(3, scored.length));
    return top[Math.floor(Math.random() * top.length)];
  }
  
  return scored[0];
}

/**
 * Main bot turn function - optimized for < 5 second response
 */
export async function botTurn(
  grid: Cell[][],
  usedWords: Set<string>,
  difficulty: BotDifficulty = 'medium'
): Promise<{ move: CandidateMove | null; shouldPass: boolean }> {
  const startTime = Date.now();
  
  try {
    const candidates = await generateCandidateMoves(grid, usedWords);
    console.log(`[Bot] Found ${candidates.length} moves in ${Date.now() - startTime}ms`);
    
    if (candidates.length === 0) {
      return { move: null, shouldPass: true };
    }
    
    const bestMove = chooseBestMove(candidates, difficulty);
    console.log(`[Bot] Total time: ${Date.now() - startTime}ms`);
    
    return { move: bestMove, shouldPass: !bestMove };
  } catch (error) {
    console.error('[Bot] Error:', error);
    return { move: null, shouldPass: true };
  }
}
