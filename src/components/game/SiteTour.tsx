import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useFirstVisit } from '@/hooks/useFirstVisit';
const nourinImg = '/rule_maker_nourin.png';
const punnoImg = '/rule_maker_punno.png';

interface TourPage {
  characters: {
    name: 'nourin' | 'punno';
    message: string;
  }[];
  buttonText: string;
}

const tourPages: TourPage[] = [
  {
    characters: [
      {
        name: 'nourin',
        message: "Hi there! Welcome to Wordvia, a turn-based word strategy game. I am your guide, Nourin who's gonna teach you how to play WordVia. Place letters on the grid to form valid English words and score points!",
      },
      {
        name: 'punno',
        message: "Hi I am Punno. Let me walk you through WordVia. You can play with 2–4 players on the same device. On your turn, place one letter anywhere or pass if you want.",
      },
    ],
    buttonText: 'Next',
  },
  {
    characters: [
      {
        name: 'nourin',
        message: "Words count only left to right or top to bottom, and only base words are allowed. No plurals, proper nouns, or repeated words — once a word is used, it can't score again!",
      },
      {
        name: 'punno',
        message: "And if your last letter creates multiple possible words, the game will ask which one you meant. Click End Game anytime to see the final scores — play smart and have fun!",
      },
    ],
    buttonText: 'End',
  },
];

export function SiteTour() {
  const { dispatch } = useGame();
  const { markAsReturning } = useFirstVisit();
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState<number[]>([]);

  const page = tourPages[currentPage];

  useEffect(() => {
    // Reset visible characters when page changes
    setVisibleCharacters([]);
    
    // Animate characters appearing one by one
    const timers: NodeJS.Timeout[] = [];
    page.characters.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleCharacters(prev => [...prev, index]);
      }, index * 800);
      timers.push(timer);
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [currentPage, page.characters]);

  const handleButtonClick = () => {
    if (currentPage < tourPages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // Mark as returning visitor and go to mode selection
      markAsReturning();
      dispatch({ type: 'SET_PHASE', phase: 'mode-select' });
    }
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(270 60% 85%) 0%, hsl(55 70% 85%) 50%, hsl(280 50% 88%) 100%)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl opacity-40"
          style={{ background: 'hsl(270 70% 70%)' }}
        />
        <div 
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full blur-3xl opacity-40"
          style={{ background: 'hsl(50 80% 70%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-30"
          style={{ background: 'hsl(300 50% 75%)' }}
        />
        {/* Comic-style dots pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(270 50% 30%) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 relative px-4 py-8 flex flex-col justify-center">
        {/* Characters container */}
        <div className="max-w-4xl mx-auto w-full space-y-8">
          {page.characters.map((character, index) => {
            const isNourin = character.name === 'nourin';
            const isVisible = visibleCharacters.includes(index);
            
            return (
              <div
                key={`${currentPage}-${index}`}
                className={`flex items-end gap-4 transition-all duration-700 ${
                  isNourin ? 'flex-row-reverse' : 'flex-row'
                } ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : isNourin 
                      ? 'opacity-0 translate-x-20' 
                      : 'opacity-0 -translate-x-20'
                }`}
              >
                {/* Character image */}
                <div 
                  className={`flex-shrink-0 relative ${
                    isVisible ? 'animate-bounce-gentle' : ''
                  }`}
                >
                  <img
                    src={isNourin ? nourinImg : punnoImg}
                    alt={isNourin ? 'Nourin' : 'Punno'}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl"
                  />
                </div>

                {/* Speech bubble */}
                <div 
                  className={`relative flex-1 max-w-lg ${
                    isNourin ? 'mr-auto' : 'ml-auto'
                  }`}
                >
                  {/* Bubble pointer */}
                  <div 
                    className={`absolute bottom-4 w-0 h-0 ${
                      isNourin 
                        ? 'right-[-12px] border-l-[15px] border-l-white border-y-[10px] border-y-transparent' 
                        : 'left-[-12px] border-r-[15px] border-r-white border-y-[10px] border-y-transparent'
                    }`}
                    style={{
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                  
                  {/* Bubble content */}
                  <div 
                    className="relative bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-800"
                    style={{
                      boxShadow: '4px 4px 0px hsl(270 40% 30%)',
                    }}
                  >
                    {/* Character name tag */}
                    <div 
                      className={`absolute -top-3 px-3 py-1 rounded-full text-sm font-bold text-white ${
                        isNourin 
                          ? 'right-4 bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'left-4 bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{
                        boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                      }}
                    >
                      {isNourin ? 'Nourin' : 'Punno'}
                    </div>
                    
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium mt-2">
                      {character.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom button */}
      <div className="relative z-10 p-6 flex justify-center">
        <button
          onClick={handleButtonClick}
          className={`px-10 py-4 rounded-full text-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
            visibleCharacters.length === page.characters.length 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          style={{
            background: 'linear-gradient(135deg, hsl(270 60% 55%) 0%, hsl(320 60% 55%) 100%)',
            boxShadow: '4px 4px 0px hsl(270 40% 30%), 0 10px 30px rgba(0,0,0,0.2)',
          }}
        >
          {page.buttonText}
        </button>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {tourPages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPage 
                ? 'bg-purple-600 w-6' 
                : 'bg-purple-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
