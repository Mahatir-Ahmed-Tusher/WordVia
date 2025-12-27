"use client";

import { GameProvider } from "@/context/GameContext";
import { Game } from "@/components/game/Game";

export default function HomePage() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

