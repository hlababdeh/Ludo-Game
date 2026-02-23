import { PlayerColor, Piece, GameState, PLAYER_CONFIG } from './types';

// The main path is 52 squares long
// We need a way to map 0-51 to X,Y coordinates on a 15x15 grid
export const getCoordinates = (pos: number, color: PlayerColor, pieceIndex: number): { x: number; y: number } => {
  // Home base positions
  if (pos === -1) {
    const baseCoords = {
      red: { x: 0, y: 0 },
      green: { x: 9, y: 0 },
      yellow: { x: 9, y: 9 },
      blue: { x: 0, y: 9 },
    };
    const offset = [
      { dx: 1.5, dy: 1.5 },
      { dx: 3.5, dy: 1.5 },
      { dx: 1.5, dy: 3.5 },
      { dx: 3.5, dy: 3.5 },
    ][pieceIndex];
    return { x: baseCoords[color].x + offset.dx, y: baseCoords[color].y + offset.dy };
  }

  // Finished position
  if (pos === 58) {
    return { x: 7, y: 7 };
  }

  // Home stretch (52-57)
  if (pos >= 52) {
    const step = pos - 52 + 1;
    switch (color) {
      case 'red': return { x: step, y: 7 };
      case 'green': return { x: 7, y: step };
      case 'yellow': return { x: 14 - step, y: 7 };
      case 'blue': return { x: 7, y: 14 - step };
    }
  }

  // Main path (0-51)
  // This is the tricky part. We need to map the global path index to grid coordinates.
  // The path starts at (6,1) for red, but we'll normalize it.
  const path = [
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
    [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
    [0, 7], [0, 8],
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
    [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
    [7, 14], [8, 14],
    [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
    [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
    [14, 7], [14, 6],
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
    [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
    [7, 0]
  ];

  // Adjust path based on color start position
  const globalIndex = (pos + PLAYER_CONFIG[color].baseOffset) % 52;
  const [y, x] = path[globalIndex];
  return { x, y };
};

export const INITIAL_PIECES: Piece[] = [
  ...(['red', 'green', 'yellow', 'blue'] as PlayerColor[]).flatMap((color) =>
    [0, 1, 2, 3].map((index) => ({
      id: `${color}-${index}`,
      color,
      position: -1,
      index,
    }))
  ),
];
