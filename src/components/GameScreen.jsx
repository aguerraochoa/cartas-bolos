import React, { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { formatCard, evaluateBestHand } from '../utils/poker';
import { Trash2, ArrowRight, Trophy } from 'lucide-react';

const Card = ({ code }) => {
    const { rank, suit, color } = formatCard(code);
    return (
        <div className={`
      w-10 h-14 bg-white rounded flex items-center justify-center 
      text-lg font-bold shadow-md border border-gray-200 select-none
      ${color === 'red' ? 'text-red-600' : 'text-slate-900'}
    `}>
            {rank}{suit}
        </div>
    );
};

const GameScreen = () => {
    const { players, deck, drawCard, removeLastCard, finishGame } = useGame();
    const scrollRef = useRef(null);

    // Calculate rankings based on current hand strength
    const rankedPlayers = players.map(player => {
        const bestHand = evaluateBestHand(player.cards);
        return { ...player, bestHand };
    }).sort((a, b) => {
        if (!a.bestHand) return 1;
        if (!b.bestHand) return -1;
        return b.bestHand.loseTo(a.bestHand) ? -1 : 1;
    });

    // Create a map of player id to their ranking position
    const rankMap = {};
    rankedPlayers.forEach((p, idx) => {
        if (p.bestHand) {
            rankMap[p.id] = idx;
        }
    });

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white">
            {/* Header / Stats */}
            <div className="bg-slate-900 p-4 shadow-lg flex justify-between items-center z-10 sticky top-0 border-b border-slate-800">
                <div>
                    <h2 className="font-bold text-xl text-yellow-500">Bowling Poker</h2>
                    <div className="text-sm text-slate-400">{deck.length} cards left</div>
                </div>
                <button
                    className="px-4 py-2 bg-emerald-600 rounded-full font-bold text-sm flex items-center space-x-2 shadow hover:bg-emerald-500 transition-colors"
                    onClick={finishGame}
                >
                    <span>Finish</span>
                    <ArrowRight size={16} />
                </button>
            </div>

            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min overflow-y-auto pb-20">
                {/* Helper text if no players or waiting */}
                {players.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 mt-10">No players</div>
                )}

                {players.map(player => {
                    const bestHand = evaluateBestHand(player.cards);
                    const ranking = rankMap[player.id];

                    // Neon Glow styling based on ranking
                    let glowClass = '';
                    let borderClass = 'border-slate-600';
                    let rankBadge = null;

                    if (ranking === 0 && bestHand) {
                        glowClass = 'shadow-[0_0_30px_rgba(255,215,0,0.4)]';
                        borderClass = 'border-yellow-400';
                        rankBadge = '🥇';
                    } else if (ranking === 1 && bestHand) {
                        glowClass = 'shadow-[0_0_25px_rgba(192,192,192,0.3)]';
                        borderClass = 'border-gray-300';
                        rankBadge = '🥈';
                    } else if (ranking === 2 && bestHand) {
                        glowClass = 'shadow-[0_0_20px_rgba(205,127,50,0.3)]';
                        borderClass = 'border-amber-600';
                        rankBadge = '🥉';
                    }

                    return (
                        <div key={player.id} className={`bg-slate-900 rounded-2xl p-4 border-2 ${borderClass} ${glowClass} transition-all flex flex-col`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-white">{player.name}</span>
                                        {rankBadge && <span className="text-xl">{rankBadge}</span>}
                                    </div>
                                    {bestHand && (
                                        <div className="text-xs text-cyan-400 font-medium mt-1 flex items-center gap-1">
                                            <Trophy size={12} />
                                            {bestHand.descr}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                        {player.cards.length} cards
                                    </span>
                                    {player.cards.length > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeLastCard(player.id);
                                            }}
                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                            title="Remove last card"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Area */}
                            <div
                                className="flex-1 min-h-[120px] bg-slate-800/60 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 transition-colors flex items-center p-3 overflow-x-auto cursor-pointer"
                                onClick={() => drawCard(player.id)}
                            >
                                {player.cards.length === 0 ? (
                                    <div className="w-full text-center text-slate-500 font-medium">Tap to Deal Card</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2 justify-start">
                                        {player.cards.map((card, idx) => (
                                            <Card key={`${card}-${idx}`} code={card} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Spacer for bottom area if needed */}
                <div className="h-4 w-full md:col-span-2"></div>
            </div>
        </div>
    );
};

export default GameScreen;
