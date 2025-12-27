import { GameProvider } from "@/context/GameContext";
import { Game } from "@/components/game/Game";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Wordvia - The Ultimate Word Game</title>
        <meta
          name="description"
          content="Play Wordvia, a colorful turn-based multiplayer word game. Challenge your friends, build words on a grid, and compete for the highest score!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Helmet>
      <GameProvider>
        <Game />
      </GameProvider>
    </>
  );
};

export default Index;
