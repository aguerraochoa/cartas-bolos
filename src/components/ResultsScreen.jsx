import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCard } from '../utils/poker';
import { Trophy, RefreshCw } from 'lucide-react';

const MiniCard = ({ code }) => {
    const { rank, suit, color } = formatCard(code);
    return (
        <div className={`
            w-8 h-10 bg-white rounded flex items-center justify-center 
            text-sm font-bold shadow-sm border border-gray-200
            ${color === 'red' ? 'text-red-600' : 'text-slate-900'}
        `}>
            {rank}{suit}
        </div>
    );
};

const ResultsScreen = () => {
    const { results, resetGame } = useGame();

    // Go back to setup screen
    const handlePlayAgain = () => {
        resetGame();
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white p-4">
            <div className="text-center mb-6 pt-4">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-yellow-500">Match Results</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {results.map((player, index) => {
                    // Determine styling based on rank
                    const isWinner = index === 0;
                    const rankStyle = isWinner
                        ? "bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border-yellow-500/50"
                        : "bg-slate-800 border-slate-700";

                    return (
                        <div key={player.id} className={`${rankStyle} p-4 rounded-xl flex flex-col space-y-3 border relative overflow-hidden`}>
                            {isWinner && <div className="absolute top-0 right-0 p-1 bg-yellow-500 text-slate-900 text-xs font-bold px-2 rounded-bl-lg">WINNER</div>}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isWinner ? 'bg-yellow-500 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl">Player {player.id}</div>
                                        <div className="text-sm text-indigo-300 font-medium">{player.handDescription}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Best Hand Display */}
                            <div className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-center gap-2">
                                {player.hand ? player.hand.cards.map((card) => (
                                    // card is an object from pokersolver {value, suit, code, ...} or string code
                                    // pokersolver returns objects, handled by specific render?
                                    // Wait, hand.cards are objects. code property is e.g. 'Ah'.
                                    <MiniCard key={card.toString()} code={card.toString()} />
                                )) : (
                                    <span className="text-gray-500">No Hand</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                className="w-full py-4 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                onClick={handlePlayAgain}
            >
                <RefreshCw size={20} />
                Play Again
            </button>
        </div>
    );
};

export default ResultsScreen;
