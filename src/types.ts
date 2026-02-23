
export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Piece {
  id: string;
  color: PlayerColor;
  position: number; // -1 for home base, 0-51 for main path, 52-57 for home stretch, 58 for finished
  index: number; // 0-3 for each color
}

export interface GameState {
  players: PlayerColor[];
  currentPlayerIndex: number;
  pieces: Piece[];
  diceValue: number | null;
  isRolling: boolean;
  winners: PlayerColor[];
  lastMove: { pieceId: string; from: number; to: number } | null;
  canRoll: boolean;
  mustMove: boolean;
}

export const BOARD_SIZE = 15; // 15x15 grid

// Path mapping for each color
// This is a simplified version of the path logic
export const PLAYER_CONFIG = {
  red: {
    startPos: 1,
    homeStretchStart: 51,
    baseOffset: 1,
    color: '#ef4444',
    lightColor: '#fee2e2',
  },
  green: {
    startPos: 14,
    homeStretchStart: 51,
    baseOffset: 14,
    color: '#22c55e',
    lightColor: '#dcfce7',
  },
  yellow: {
    startPos: 27,
    homeStretchStart: 51,
    baseOffset: 27,
    color: '#eab308',
    lightColor: '#fef9c3',
  },
  blue: {
    startPos: 40,
    homeStretchStart: 51,
    baseOffset: 40,
    color: '#3b82f6',
    lightColor: '#dbeafe',
  },
};
