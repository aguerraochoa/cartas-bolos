import React, { useRef, useEffect } from 'react';
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

    // Auto scroll logic if needed, or just let user scroll

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white">
            {/* Header / Stats */}
            <div className="bg-slate-900 p-4 shadow-lg flex justify-between items-center z-10 sticky top-0">
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

            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-min overflow-y-auto pb-20">
                {/* Helper text if no players or waiting */}
                {players.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 mt-10">No players</div>
                )}

                {players.map(player => {
                    const bestHand = evaluateBestHand(player.cards);

                    return (
                        <div key={player.id} className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 flex flex-col relative border border-slate-700 shadow-xl transition-all hover:border-slate-600">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="font-bold text-lg text-slate-200 block">{player.name}</span>
                                    {bestHand && (
                                        <div className="text-xs text-yellow-400 font-medium flex items-center gap-1 mt-1">
                                            <Trophy size={12} />
                                            {bestHand.name}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-md">
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
                                className="flex-1 min-h-[140px] bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-colors flex items-center p-3 overflow-x-auto cursor-pointer"
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
