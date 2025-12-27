import { memo, forwardRef } from 'react';
import { Cell } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCellProps {
  cell: Cell;
  row: number;
  col: number;
  isSelected: boolean;
  cellSize: number;
  onSelect: (row: number, col: number) => void;
}

export const GameCell = memo(
  forwardRef<HTMLButtonElement, GameCellProps>(function GameCell(
    { cell, row, col, isSelected, cellSize, onSelect },
    ref
  ) {
    const isEmpty = cell.letter === '';

    const handleClick = () => {
      if (isEmpty) {
        onSelect(row, col);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={!isEmpty}
        className={cn(
          'cell-base font-display transition-all duration-200',
          isEmpty && 'cell-empty cursor-pointer hover:bg-card/60 hover:scale-105 active:scale-95',
          !isEmpty && 'cell-filled cursor-default',
          isSelected && 'cell-highlight animate-pulse-glow',
          cell.isNew && 'animate-letter-pop',
          cell.isPartOfWord && cell.isValid === true && 'cell-valid',
          cell.isPartOfWord && cell.isValid === false && 'cell-invalid',
        )}
        style={{
          width: cellSize,
          height: cellSize,
          fontSize: cellSize * 0.5,
          boxShadow: !isEmpty 
            ? '0 4px 12px hsl(0 0% 0% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)'
            : undefined,
        }}
      >
        {cell.letter}
      </button>
    );
  })
);
