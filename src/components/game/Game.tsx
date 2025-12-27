"use client";

import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { SplashScreen } from './SplashScreen';
import { SiteTour } from './SiteTour';
import { ModeSelection, GameMode } from './ModeSelection';
import { GameSetup } from './GameSetup';
import { GameBoard } from './GameBoard';
import { GameOver } from './GameOver';

export function Game() {
  const { state, dispatch } = useGame();
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    dispatch({ type: 'SET_MODE', mode });
    dispatch({ type: 'SET_PHASE', phase: 'setup' });
  };

  switch (state.gamePhase) {
    case 'splash':
      return <SplashScreen />;
    case 'tour':
      return <SiteTour />;
    case 'mode-select':
      return <ModeSelection onModeSelect={handleModeSelect} />;
    case 'setup':
      return <GameSetup gameMode={state.gameMode} />;
    case 'playing':
      return <GameBoard />;
    case 'ended':
      return <GameOver />;
    default:
      return <SplashScreen />;
  }
}
