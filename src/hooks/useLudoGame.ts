import { useState, useCallback, useEffect } from 'react';
import { PlayerColor, Piece, GameState, PLAYER_CONFIG } from '../types';
import { INITIAL_PIECES } from '../constants';
import confetti from 'canvas-confetti';

export const useLudoGame = () => {
  const [state, setState] = useState<GameState>({
    players: ['red', 'green', 'yellow', 'blue'],
    currentPlayerIndex: 0,
    pieces: INITIAL_PIECES,
    diceValue: null,
    isRolling: false,
    winners: [],
    lastMove: null,
    canRoll: true,
    mustMove: false,
  });

  const currentPlayer = state.players[state.currentPlayerIndex];

  const nextTurn = useCallback(() => {
    setState((prev) => {
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      // Skip winners
      let attempts = 0;
      while (prev.winners.includes(prev.players[nextIndex]) && attempts < prev.players.length) {
        nextIndex = (nextIndex + 1) % prev.players.length;
        attempts++;
      }
      
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        canRoll: true,
        diceValue: null,
        mustMove: false,
        isRolling: false
      };
    });
  }, []);

  // Robust turn transition effect
  useEffect(() => {
    // If a turn has ended (no more moves possible or move completed) and it's not a "roll again" (6)
    if (state.diceValue !== null && !state.isRolling && !state.mustMove && !state.canRoll) {
      const timer = setTimeout(() => {
        nextTurn();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.diceValue, state.isRolling, state.mustMove, state.canRoll, nextTurn]);

  const rollDice = useCallback(() => {
    if (!state.canRoll || state.isRolling) return;

    setState((prev) => ({ ...prev, isRolling: true, diceValue: null }));

    // Simulate rolling animation
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      
      setState((prev) => {
        const movablePieces = getMovablePieces(prev.pieces, prev.players[prev.currentPlayerIndex], newValue);
        
        if (movablePieces.length === 0) {
          // No moves possible, turn will be skipped by useEffect
          return { ...prev, diceValue: newValue, isRolling: false, canRoll: false, mustMove: false };
        }

        return {
          ...prev,
          diceValue: newValue,
          isRolling: false,
          canRoll: false,
          mustMove: true,
        };
      });
    }, 800);
  }, [state.canRoll, state.isRolling, state.currentPlayerIndex]);

  const getMovablePieces = (pieces: Piece[], color: PlayerColor, dice: number): Piece[] => {
    return pieces.filter((p) => {
      if (p.color !== color) return false;
      if (p.position === 58) return false; // Already finished

      // Piece in base needs a 6 to start
      if (p.position === -1) {
        return dice === 6;
      }

      // Check if move exceeds home
      if (p.position >= 52) {
        return p.position + dice <= 58;
      }

      return true;
    });
  };

  const movePiece = useCallback((pieceId: string) => {
    if (!state.mustMove || state.diceValue === null) return;

    const piece = state.pieces.find((p) => p.id === pieceId);
    if (!piece || piece.color !== currentPlayer) return;

    // Validate move
    const movable = getMovablePieces(state.pieces, currentPlayer, state.diceValue);
    if (!movable.find(p => p.id === pieceId)) return;

    setState((prev) => {
      const dice = prev.diceValue!;
      let newPos = piece.position;

      if (piece.position === -1) {
        if (dice === 6) newPos = 0;
      } else {
        newPos += dice;
      }

      // Check for captures
      let updatedPieces = prev.pieces.map((p) => {
        if (p.id === pieceId) return { ...p, position: newPos };
        return p;
      });

      // Capture logic (only on main path 0-51)
      if (newPos < 52 && newPos >= 0) {
        const globalPos = (newPos + PLAYER_CONFIG[currentPlayer].baseOffset) % 52;
        
        // Standard Ludo safe spots (global indices)
        const safeSpots = [1, 9, 14, 22, 27, 35, 40, 48];
        const isSafeSpot = safeSpots.includes(globalPos);

        if (!isSafeSpot) {
          updatedPieces = updatedPieces.map(p => {
            if (p.color !== currentPlayer && p.position < 52 && p.position >= 0) {
              const otherGlobalPos = (p.position + PLAYER_CONFIG[p.color].baseOffset) % 52;
              if (otherGlobalPos === globalPos) {
                return { ...p, position: -1 }; // Send back to base
              }
            }
            return p;
          });
        }
      }

      // Check for winner
      const playerPieces = updatedPieces.filter(p => p.color === currentPlayer);
      const allFinished = playerPieces.every(p => p.position === 58);
      
      let newWinners = prev.winners;
      if (allFinished && !prev.winners.includes(currentPlayer)) {
        newWinners = [...prev.winners, currentPlayer];
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [PLAYER_CONFIG[currentPlayer].color]
        });
      }

      return {
        ...prev,
        pieces: updatedPieces,
        mustMove: false,
        winners: newWinners,
        lastMove: { pieceId, from: piece.position, to: newPos }
      };
    });

    // If rolled a 6, player gets another turn
    if (state.diceValue === 6) {
      setState(prev => ({ ...prev, canRoll: true, diceValue: null }));
    }
  }, [state.mustMove, state.diceValue, currentPlayer, state.pieces]);

  return {
    state,
    rollDice,
    movePiece,
  };
};
