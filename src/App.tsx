import { useLudoGame } from './hooks/useLudoGame';
import { LudoBoard } from './components/LudoBoard';
import { Piece } from './components/Piece';
import { Dice } from './components/Dice';
import { PLAYER_CONFIG, PlayerColor } from './types';
import { Trophy, Users, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { state, rollDice, movePiece } = useLudoGame();

  const currentPlayerColor = state.players[state.currentPlayerIndex];
  
  const isPieceMovable = (pieceId: string) => {
    if (!state.mustMove || state.diceValue === null) return false;
    const piece = state.pieces.find(p => p.id === pieceId);
    if (!piece || piece.color !== currentPlayerColor) return false;
    
    // Check if move is valid
    if (piece.position === -1) return state.diceValue === 6;
    if (piece.position >= 52) return piece.position + state.diceValue <= 58;
    return true;
  };

  const getPlayerName = (color: PlayerColor) => {
    const names: Record<PlayerColor, string> = {
      red: 'الأحمر',
      green: 'الأخضر',
      yellow: 'الأصفر',
      blue: 'الأزرق',
    };
    return names[color];
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#1a1a1a] font-sans p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">لودو برو</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Ludo Professional Edition</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Game Board Section */}
        <div className="flex flex-col items-center">
          <LudoBoard currentPlayer={currentPlayerColor}>
            {state.pieces.map((piece) => (
              <Piece
                key={piece.id}
                piece={piece}
                isMovable={isPieceMovable(piece.id)}
                onClick={() => movePiece(piece.id)}
                currentPlayer={currentPlayerColor}
              />
            ))}
          </LudoBoard>
        </div>

        {/* Controls and Info Section */}
        <div className="flex flex-col gap-6">
          {/* Current Turn Card */}
          <motion.div 
            layout
            className="bg-white rounded-3xl p-6 shadow-sm border border-black/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-gray-400" />
                <h2 className="font-semibold text-lg">الدور الحالي</h2>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: PLAYER_CONFIG[currentPlayerColor].color }}
              >
                {getPlayerName(currentPlayerColor)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 py-4">
              <div className="relative">
                <Dice
                  value={state.diceValue}
                  isRolling={state.isRolling}
                  color={currentPlayerColor}
                  onClick={rollDice}
                  disabled={!state.canRoll || state.winners.includes(currentPlayerColor)}
                />
                {state.canRoll && !state.isRolling && (
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -inset-2 border-2 border-dashed rounded-2xl pointer-events-none"
                    style={{ borderColor: PLAYER_CONFIG[currentPlayerColor].color }}
                  />
                )}
              </div>

              <div className="text-center min-h-[40px]">
                <AnimatePresence mode="wait">
                  {state.mustMove ? (
                    <motion.p
                      key="must-move"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-gray-600"
                    >
                      اختر قطعة لتحريكها ({state.diceValue} خطوات)
                    </motion.p>
                  ) : state.isRolling ? (
                    <motion.p
                      key="rolling"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-gray-400 italic"
                    >
                      جاري رمي النرد...
                    </motion.p>
                  ) : (
                    <motion.p
                      key="roll-now"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm font-medium text-gray-600"
                    >
                      اضغط على النرد للعب
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={20} className="text-yellow-500" />
              <h2 className="font-semibold text-lg">لوحة المتصدرين</h2>
            </div>

            <div className="space-y-3">
              {state.winners.length > 0 ? (
                state.winners.map((color, index) => (
                  <div 
                    key={color}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: PLAYER_CONFIG[color].color }}
                      />
                      <span className="font-medium">{getPlayerName(color)}</span>
                    </div>
                    <Trophy size={16} className="text-yellow-500" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4 italic">لا يوجد فائزون بعد</p>
              )}
            </div>
          </div>

          {/* Game Rules / Info */}
          <div className="bg-black text-white rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold mb-2">كيفية اللعب</h3>
            <ul className="text-xs space-y-2 opacity-80 list-disc list-inside">
              <li>تحتاج إلى رقم 6 لإخراج قطعة من القاعدة.</li>
              <li>إذا حصلت على 6، تحصل على رمية إضافية.</li>
              <li>الهبوط على قطعة الخصم يعيدها إلى القاعدة.</li>
              <li>أول من يوصل جميع قطعه إلى المركز هو الفائز.</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-medium">
        Designed for Professional Gameplay • 2024
      </footer>
    </div>
  );
}
