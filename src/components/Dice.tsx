import React from 'react';
import { motion } from 'motion/react';
import { PlayerColor } from '../types';
import { PLAYER_CONFIG } from '../types';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  color: PlayerColor;
  onClick: () => void;
  disabled: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, isRolling, color, onClick, disabled }) => {
  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
  };

  const displayValue = value || 1;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-16 h-16 rounded-xl shadow-lg flex items-center justify-center cursor-pointer transition-opacity ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
      }`}
      style={{ backgroundColor: PLAYER_CONFIG[color].color }}
    >
      <motion.div
        animate={isRolling ? {
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        } : { rotate: 0, scale: 1 }}
        transition={isRolling ? { duration: 0.4, repeat: Infinity } : { duration: 0.2 }}
        className="w-12 h-12 bg-white rounded-lg relative"
      >
        {dots[displayValue as keyof typeof dots].map(([x, y], i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </motion.div>
      
      {!disabled && !isRolling && !value && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">
          إرمِ النرد
        </div>
      )}
    </motion.button>
  );
};
