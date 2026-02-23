import React from 'react';
import { PlayerColor, PLAYER_CONFIG } from '../types';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

export const LudoBoard: React.FC<{ children: React.ReactNode; currentPlayer: PlayerColor }> = ({ children, currentPlayer }) => {
  const renderBase = (color: PlayerColor, x: number, y: number) => {
    const isCurrent = currentPlayer === color;
    
    return (
      <motion.div
        animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={isCurrent ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
        className={`absolute w-[40%] h-[40%] border-2 border-gray-800 flex items-center justify-center transition-all duration-500 ${
          isCurrent ? 'z-20 border-white shadow-2xl' : 'opacity-40 grayscale-[0.5]'
        }`}
        style={{
          left: `${(x / 15) * 100}%`,
          top: `${(y / 15) * 100}%`,
          backgroundColor: PLAYER_CONFIG[color].color,
        }}
      >
        <div className="relative w-[70%] h-[70%] bg-white rounded-xl shadow-inner grid grid-cols-2 gap-4 p-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-full border-2 border-gray-200"
              style={{ backgroundColor: PLAYER_CONFIG[color].lightColor }}
            />
          ))}
          
          {/* Central Avatar for Active Player */}
          {isCurrent && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden z-10"
            >
              <img 
                src={`https://picsum.photos/seed/${color}/200/200`} 
                alt={`${color} player`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderPath = () => {
    const cells = [];
    // Safe spots coordinates (i, j)
    const safeSpots = [
      [6, 1], [8, 2], [1, 8], [2, 6], [8, 13], [6, 12], [13, 6], [12, 8]
    ];

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        // Skip base areas and home center
        if (
          (i < 6 && j < 6) ||
          (i < 6 && j > 8) ||
          (i > 8 && j < 6) ||
          (i > 8 && j > 8) ||
          (i >= 6 && i <= 8 && j >= 6 && j <= 8)
        ) {
          continue;
        }

        let bgColor = 'white';
        let cellColor: PlayerColor | null = null;
        const isSafe = safeSpots.some(([si, sj]) => si === i && sj === j);

        // Home stretch
        if (i === 7 && j > 0 && j < 6) { bgColor = PLAYER_CONFIG.red.color; cellColor = 'red'; }
        if (i === 7 && j > 8 && j < 14) { bgColor = PLAYER_CONFIG.yellow.color; cellColor = 'yellow'; }
        if (j === 7 && i > 0 && i < 6) { bgColor = PLAYER_CONFIG.green.color; cellColor = 'green'; }
        if (j === 7 && i > 8 && i < 14) { bgColor = PLAYER_CONFIG.blue.color; cellColor = 'blue'; }

        // Start positions (also safe)
        if (i === 6 && j === 1) { bgColor = PLAYER_CONFIG.red.color; cellColor = 'red'; }
        if (i === 1 && j === 8) { bgColor = PLAYER_CONFIG.green.color; cellColor = 'green'; }
        if (i === 8 && j === 13) { bgColor = PLAYER_CONFIG.yellow.color; cellColor = 'yellow'; }
        if (i === 13 && j === 6) { bgColor = PLAYER_CONFIG.blue.color; cellColor = 'blue'; }

        const isDimmed = cellColor && cellColor !== currentPlayer;

        cells.push(
          <div
            key={`${i}-${j}`}
            className={`absolute w-[6.66%] h-[6.66%] border border-gray-200 flex items-center justify-center transition-all duration-500 ${isDimmed ? 'opacity-30 grayscale' : ''}`}
            style={{
              left: `${(j / 15) * 100}%`,
              top: `${(i / 15) * 100}%`,
              backgroundColor: bgColor,
            }}
          >
            {isSafe && (
              <Star 
                size={12} 
                className={bgColor !== 'white' ? 'text-white fill-current' : 'text-gray-300 fill-current'} 
              />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="relative aspect-square w-full max-w-[600px] bg-white border-4 border-gray-800 shadow-2xl overflow-hidden rounded-lg">
      {/* Grid Background */}
      {renderPath()}

      {/* Bases */}
      {renderBase('red', 0, 0)}
      {renderBase('green', 9, 0)}
      {renderBase('yellow', 9, 9)}
      {renderBase('blue', 0, 9)}

      {/* Center Home */}
      <div className="absolute left-[40%] top-[40%] w-[20%] h-[20%] border-2 border-gray-800 overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="0,0 50,50 0,100" fill={PLAYER_CONFIG.red.color} />
          <polygon points="0,0 100,0 50,50" fill={PLAYER_CONFIG.green.color} />
          <polygon points="100,0 100,100 50,50" fill={PLAYER_CONFIG.yellow.color} />
          <polygon points="0,100 100,100 50,50" fill={PLAYER_CONFIG.blue.color} />
        </svg>
      </div>

      {/* Pieces */}
      {children}
    </div>
  );
};
