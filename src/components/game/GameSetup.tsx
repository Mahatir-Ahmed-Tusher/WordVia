import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { HomeButton } from './HomeButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Plus, Minus, Grid3X3, Sparkles, Swords, Bot, Zap, Brain, Crown } from 'lucide-react';
const choosePlayersIcon = '/choose-players.png';
const wordviaLogo = '/wordvia-logo.png';
const startButton = '/start-button.png';
const player1Avatar = '/player-1.png';
const player2Avatar = '/player-2.png';
const player3Avatar = '/player-3.png';
const player4Avatar = '/player-4.png';
import { Button } from '@/components/ui/button';
import { GameMode, BotDifficulty } from '@/types/game';

const PLAYER_AVATARS = [player1Avatar, player2Avatar, player3Avatar, player4Avatar];

const DIFFICULTY_OPTIONS: { value: BotDifficulty; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'easy', label: 'Easy', icon: <Zap className="w-4 h-4" />, description: 'Random moves' },
  { value: 'medium', label: 'Medium', icon: <Bot className="w-4 h-4" />, description: 'Smart scoring' },
  { value: 'hard', label: 'Hard', icon: <Brain className="w-4 h-4" />, description: 'Strategic play' },
  { value: 'expert', label: 'Expert', icon: <Crown className="w-4 h-4" />, description: 'Full tactics' },
];

interface GameSetupProps {
  gameMode: GameMode;
}

export function GameSetup({ gameMode }: GameSetupProps) {
  const { dispatch } = useGame();
  const isPvB = gameMode === 'pvb';
  
  // For PvP: 2-4 players. For PvB: 1-3 humans + 1 bot
  const [humanCount, setHumanCount] = useState(isPvB ? 1 : 2);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '', '']);
  const [gridSize, setGridSize] = useState(5);
  const [challengeMode, setChallengeMode] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('medium');

  const maxHumans = isPvB ? 3 : 4;
  const minHumans = isPvB ? 1 : 2;
  const totalPlayers = isPvB ? humanCount + 1 : humanCount;

  const handleAddPlayer = () => {
    if (humanCount < maxHumans) {
      setHumanCount(prev => prev + 1);
    }
  };

  const handleRemovePlayer = () => {
    if (humanCount > minHumans) {
      setHumanCount(prev => prev - 1);
    }
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    let names: string[];
    let botPlayerIndex: number | undefined;
    
    if (isPvB) {
      // Human players first, then bot
      names = playerNames.slice(0, humanCount).map((name, i) => 
        name.trim() || `Player ${i + 1}`
      );
      names.push('Wordvia Bot');
      botPlayerIndex = names.length - 1;
    } else {
      names = playerNames.slice(0, humanCount).map((name, i) => 
        name.trim() || `Player ${i + 1}`
      );
    }
    
    dispatch({ 
      type: 'SETUP_GAME', 
      players: names, 
      gridSize, 
      challengeMode,
      gameMode,
      botDifficulty,
      botPlayerIndex,
    });
  };

  const playerColors = [
    { bg: 'hsl(45, 96%, 55%)', text: 'hsl(270, 55%, 12%)' },
    { bg: 'hsl(280, 70%, 60%)', text: 'white' },
    { bg: 'hsl(160, 70%, 45%)', text: 'white' },
    { bg: 'hsl(20, 90%, 55%)', text: 'white' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col relative overflow-hidden">
      {/* Home button */}
      <HomeButton />
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header with enlarged logo */}
      <div className="relative z-10 text-center mb-6 animate-slide-up">
        <div className="relative inline-block">
          {/* Glow effects */}
          <div 
            className="absolute inset-0 blur-2xl animate-glow-pulse"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)',
              transform: 'scale(1.8)',
            }}
          />
          <div 
            className="absolute inset-0 blur-xl animate-breathe"
            style={{
              background: 'radial-gradient(circle, hsl(var(--gold-light) / 0.4) 0%, transparent 60%)',
              transform: 'scale(1.4)',
            }}
          />
          <img 
            src={wordviaLogo} 
            alt="Wordvia" 
            className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto animate-breathe"
            style={{
              filter: 'drop-shadow(0 0 25px hsl(var(--primary) / 0.6)) drop-shadow(0 0 50px hsl(var(--primary) / 0.3))',
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          {isPvB && <Bot className="w-5 h-5 text-accent-foreground" />}
          <p className="text-muted-foreground font-display text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {isPvB ? 'Human vs Bot' : 'Human vs Human'}
          </p>
        </div>
      </div>

      {/* Setup form */}
      <div className="relative z-10 flex-1 max-w-lg mx-auto w-full space-y-4 overflow-y-auto">
        {/* Players section */}
        <div 
          className="glass-card p-5 space-y-4 animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={choosePlayersIcon} alt="" className="w-9 h-9 object-contain" />
              <Label className="text-lg font-display font-semibold">
                {isPvB ? 'Human Players' : 'Players'}
              </Label>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemovePlayer}
                disabled={humanCount <= minHumans}
                className="w-8 h-8 rounded-full hover:bg-accent"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-6 text-center font-display font-bold text-lg text-primary">
                {humanCount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddPlayer}
                disabled={humanCount >= maxHumans}
                className="w-8 h-8 rounded-full hover:bg-accent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Player name inputs */}
          <div className="space-y-2">
            {Array.from({ length: humanCount }, (_, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 animate-slide-in-right"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 transition-transform hover:scale-110 overflow-hidden">
                  <img 
                    src={PLAYER_AVATARS[i]} 
                    alt={`Player ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Input
                  value={playerNames[i]}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  className="flex-1 h-11 bg-card text-card-foreground border-border/30 font-body text-base placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  maxLength={15}
                />
              </div>
            ))}
            
            {/* Bot indicator for PvB mode */}
            {isPvB && (
              <div 
                className="flex items-center gap-3 animate-slide-in-right p-2 rounded-xl bg-accent/10 border border-accent/20"
                style={{ animationDelay: `${0.2 + humanCount * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[hsl(210,70%,50%)] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-foreground">Wordvia Bot</p>
                  <p className="text-xs text-muted-foreground">AI Opponent</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bot Difficulty (only for PvB mode) */}
        {isPvB && (
          <div 
            className="glass-card p-5 animate-slide-up"
            style={{ animationDelay: '0.25s' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-accent/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent-foreground" />
              </div>
              <Label className="text-lg font-display font-semibold">Bot Difficulty</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBotDifficulty(option.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    botDifficulty === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border/30 bg-card/50 hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={botDifficulty === option.value ? 'text-primary' : 'text-muted-foreground'}>
                      {option.icon}
                    </span>
                    <span className="font-display font-semibold text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid size section */}
        <div 
          className="glass-card p-5 animate-slide-up"
          style={{ animationDelay: isPvB ? '0.35s' : '0.3s' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/30 flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <Label className="text-lg font-display font-semibold">Grid Size</Label>
            </div>
            <div 
              className="px-3 py-1.5 rounded-xl bg-primary/20 font-display font-bold text-xl text-primary"
              style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.3)' }}
            >
              {gridSize} × {gridSize}
            </div>
          </div>
          
          <Slider
            value={[gridSize]}
            onValueChange={(value) => setGridSize(value[0])}
            min={5}
            max={10}
            step={1}
            className="py-3"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground mt-1 font-display">
            <span>5×5 (Quick)</span>
            <span>10×10 (Epic)</span>
          </div>

          {/* Preview grid */}
          <div className="flex justify-center mt-4">
            <div 
              className="grid gap-1 p-3 bg-secondary/30 rounded-xl border border-border/20"
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(gridSize, 6)}, 1fr)`,
                width: 'fit-content'
              }}
            >
              {Array.from({ length: Math.min(gridSize * gridSize, 36) }, (_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-card/90 rounded-md shadow-sm animate-scale-bounce"
                  style={{ animationDelay: `${0.4 + i * 0.02}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Challenge Mode toggle - available for both PvP and PvB */}
        <div 
          className="glass-card p-5 animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/30 flex items-center justify-center">
                <Swords className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <Label className="text-lg font-display font-semibold">Challenge Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Players can challenge words for meaning
                </p>
              </div>
            </div>
            <Switch
              checked={challengeMode}
              onCheckedChange={setChallengeMode}
            />
          </div>
          
          {challengeMode && (
            <div className="mt-3 p-2 rounded-xl bg-accent/10 border border-accent/20 text-xs text-muted-foreground animate-slide-up">
              <p className="flex items-start gap-2">
                <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-accent-foreground" />
                <span>
                  Word meanings won&apos;t be shown. Players can challenge scored words.
                  {isPvB && ' Bot will provide meaning automatically when challenged.'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div 
        className="relative z-10 mt-6 max-w-lg mx-auto w-full animate-slide-up flex justify-center"
        style={{ animationDelay: '0.5s' }}
      >
        <button
          onClick={handleStartGame}
          className="transition-transform hover:scale-105 active:scale-95"
        >
          <img 
            src={startButton} 
            alt="Start Game" 
            className="h-14 object-contain"
          />
        </button>
      </div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  );
}