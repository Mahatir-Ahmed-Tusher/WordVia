import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Grid3X3, RotateCcw, Type, Trophy, MessageSquare, Flag, Lightbulb, ArrowRight, ArrowDown, X } from "lucide-react";
import wordviaLogo from "@/assets/wordvia-logo.png";

const Rules = () => {
  return (
    <>
      <Helmet>
        <title>How to Play WordVia - Game Rules</title>
        <meta
          name="description"
          content="Learn how to play WordVia. Simple rules, strategic gameplay, and endless fun with words!"
        />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground overflow-y-auto">
        <div className="container max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="p-2 rounded-xl bg-secondary hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <img src={wordviaLogo} alt="WordVia Logo" className="w-12 h-12" />
              <h1 className="text-3xl font-display font-bold text-primary glow-text">
                Official Rules
              </h1>
            </div>
          </div>

          {/* Section 1: Players */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">1. Players</h2>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Wordvia can be played by <strong>2 to 4 players</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Currently, all players play on the same device.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Each player enters their name before the game starts.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Game Board */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">2. Game Board</h2>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>The game is played on a square grid.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Players can choose the grid size at the start: <strong>Minimum 5 × 5</strong>. Larger grids are allowed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Each cell can hold only one letter.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Turns & Actions */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">3. Turns & Actions</h2>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Players take turns in a fixed order.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>On each turn, a player may:</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Place exactly one letter in any empty cell, or</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Pass their turn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Players may type letters in any order or position, but scoring depends on valid word rules.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Word Formation Rules */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Type className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-foreground mb-3">4. Word Formation Rules</h2>
                <p className="text-foreground/80 mb-4">A word is considered valid only if <strong>all conditions</strong> below are met:</p>
                
                {/* Direction Rules */}
                <div className="bg-secondary/50 rounded-lg p-4 mb-3">
                  <h3 className="font-display font-semibold text-primary mb-2 flex items-center gap-2">
                    <span className="text-green-500">✔</span> Direction Rules
                  </h3>
                  <p className="text-foreground/80 mb-2">Words must read:</p>
                  <div className="flex flex-wrap gap-4 mb-3">
                    <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Left → Right (horizontal)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-lg">
                      <ArrowDown className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Top → Bottom (vertical)</span>
                    </div>
                  </div>
                  <p className="text-foreground/60 text-sm mb-2">Not allowed:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg">
                      <X className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-foreground/70">Right → Left (e.g., XOF for FOX)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-lg">
                      <X className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-foreground/70">Bottom → Top</span>
                    </div>
                  </div>
                </div>

                {/* Word Length */}
                <div className="bg-secondary/50 rounded-lg p-4 mb-3">
                  <h3 className="font-display font-semibold text-primary mb-2 flex items-center gap-2">
                    <span className="text-green-500">✔</span> Word Length
                  </h3>
                  <p className="text-foreground/80">A valid word must contain at least <strong>2 letters</strong>.</p>
                </div>

                {/* Dictionary Rules */}
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-display font-semibold text-primary mb-2 flex items-center gap-2">
                    <span className="text-green-500">✔</span> Dictionary Rules
                  </h3>
                  <p className="text-foreground/80 mb-2">Words must be valid <strong>base-form English words</strong>.</p>
                  <p className="text-foreground/60 text-sm mb-2">Not allowed:</p>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li className="flex items-center gap-2">
                      <X className="w-3 h-3 text-red-500" />
                      <span>Proper nouns (names of people, places, brands, companies)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-3 h-3 text-red-500" />
                      <span>Plurals ending with "s"</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-3 h-3 text-red-500" />
                      <span>Verb tenses (ED, ING)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-3 h-3 text-red-500" />
                      <span>Abbreviations or slang</span>
                    </li>
                  </ul>
                  <p className="text-foreground/80 mt-3 text-sm border-t border-border/30 pt-3">
                    Once a word has been successfully scored, the <strong>same word cannot be scored again</strong> by any player.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Scoring System */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-foreground mb-3">5. Scoring System</h2>
                <ul className="space-y-2 text-foreground/80 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>A player scores points equal to the <strong>number of letters</strong> in the valid word.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>If no valid word is formed after placing a letter, the player scores <strong>0 points</strong> for that turn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>If multiple valid words are formed in one turn, all points are added together.</span>
                  </li>
                </ul>
                
                {/* Example */}
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-display font-semibold text-muted-foreground mb-2 text-sm">Example:</h3>
                  <ul className="space-y-1 text-sm text-foreground/70">
                    <li>Player 1 places <strong>O</strong> → No word → <span className="text-muted-foreground">0 points</span></li>
                    <li>Player 2 places <strong>X</strong> next to O → Forms <span className="text-primary font-semibold">OX</span> → <span className="text-green-500">2 points</span></li>
                    <li>Player 1 places <strong>F</strong> to form <span className="text-primary font-semibold">FOX</span> → <span className="text-green-500">3 points</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Word Confirmation */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">6. Word Confirmation (Last-Letter Challenge)</h2>
                <p className="text-foreground/80 mb-3">If a player's last placed letter creates <strong>multiple possible valid words</strong>:</p>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>The game will ask the player to confirm which word they intended.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Only words that:</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Include the last placed letter, and</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Follow all word rules</span>
                  </li>
                  <li className="ml-4 text-foreground/70">...will be shown as options.</li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>The selected word is then scored.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: End of Game */}
          <section className="glass-card p-5 mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Flag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">7. End of Game</h2>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Any player may press the <strong>End Game</strong> button at any time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>The game immediately:</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Stops further turns</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Totals all players' scores</span>
                  </li>
                  <li className="ml-6 flex items-start gap-2">
                    <span className="text-muted-foreground">◦</span>
                    <span>Declares the winner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>The player with the <strong>highest total score wins</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ties are allowed.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8: Fair Play & Strategy */}
          <section className="glass-card p-5 mb-8 animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground mb-3">8. Fair Play & Strategy</h2>
                <ul className="space-y-2 text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Repeating previously scored words gives <strong>no points</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Blocking opponents' future words is a <strong>valid strategy</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Passing is allowed and sometimes <strong>strategic</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Back to Home */}
          <div className="text-center pb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition-opacity"
            >
              Start Playing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rules;
