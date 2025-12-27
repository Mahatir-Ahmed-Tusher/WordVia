"use client";

import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function HomeButton() {
  const { dispatch } = useGame();

  const handleGoHome = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleGoHome}
      className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:bg-background/80 hover:border-primary/50 transition-all duration-300 shadow-lg"
      title="Return to Main Page"
    >
      <Home className="w-5 h-5 text-foreground" />
    </Button>
  );
}
