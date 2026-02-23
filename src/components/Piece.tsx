import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Piece as PieceType, PLAYER_CONFIG, PlayerColor } from '../types';
import { getCoordinates } from '../constants';
import { ChevronDown } from 'lucide-react';

interface PieceProps {
  piece: PieceType;
  isMovable: boolean;
  onClick: () => void;
  currentPlayer: PlayerColor;
}

export const Piece: React.FC<PieceProps> = ({ piece, isMovable, onClick, currentPlayer }) => {
  const { x, y } = getCoordinates(piece.position, piece.color, piece.index);
  const isDimmed = piece.color !== currentPlayer;

  return (
    <motion.div
      layout
      initial={false}
      animate={{
        left: `${(x / 15) * 100}%`,
        top: `${(y / 15) * 100}%`,
        scale: isMovable ? 1.1 : 1,
        zIndex: isMovable ? 20 : 10,
        opacity: isDimmed ? 0.4 : 1,
        filter: isDimmed ? 'grayscale(0.5)' : 'grayscale(0)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute w-[6.66%] h-[6.66%] p-1"
    >
      <AnimatePresence>
        {isMovable && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -15 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ 
              y: { repeat: Infinity, duration: 0.6, repeatType: 'reverse', ease: 'easeInOut' },
              opacity: { duration: 0.2 }
            }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          >
            <ChevronDown size={16} className="text-white fill-current drop-shadow-md" style={{ color: PLAYER_CONFIG[piece.color].color }} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        disabled={!isMovable}
        className={`w-full h-full rounded-full shadow-md border-2 border-white flex items-center justify-center transition-all ${
          isMovable ? 'cursor-pointer ring-4 ring-white/50' : 'cursor-default'
        }`}
        style={{ backgroundColor: PLAYER_CONFIG[piece.color].color }}
      >
        <span className="text-[10px] font-black text-white drop-shadow-md select-none">
          {piece.index + 1}
        </span>
      </button>
    </motion.div>
  );
};
