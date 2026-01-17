import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Play } from 'lucide-react';

const SetupScreen = () => {
    const { startGame } = useGame();
    const [names, setNames] = useState(Array(4).fill('').map((_, i) => `Player ${i + 1}`));

    // Update names array when count changes
    const updateCount = (newCount) => {
        setCount(newCount);
        setNames(prev => {
            const newNames = [...prev];
            if (newCount > prev.length) {
                // Add new names
                for (let i = prev.length; i < newCount; i++) {
                    newNames.push(`Player ${i + 1}`);
                }
            } else {
                // Trim array
                return newNames.slice(0, newCount);
            }
            return newNames;
        });
    };

    const handleNameChange = (index, value) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4 relative overflow-hidden overflow-y-auto">
            {/* Decorative background elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 -z-10"></div>

            <div className="text-center mb-8 pt-10">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                    Bowling Cards
                </h1>
                <p className="text-slate-400 text-lg">Poker hand betting for bowling night</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md mb-10">
                <label className="block text-slate-300 text-sm font-bold mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
                    <Users size={16} />
                    Number of Players
                </label>

                <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-2 mb-8 border border-slate-700">
                    <button
                        className="w-14 h-14 rounded-xl bg-slate-700 text-2xl font-bold hover:bg-slate-600 active:scale-95 transition-all text-white flex items-center justify-center shadow-lg"
                        onClick={() => updateCount(Math.max(2, count - 1))}
                    >-</button>
                    <span className="text-5xl font-bold w-16 text-center text-white tabular-nums">{count}</span>
                    <button
                        className="w-14 h-14 rounded-xl bg-slate-700 text-2xl font-bold hover:bg-slate-600 active:scale-95 transition-all text-white flex items-center justify-center shadow-lg"
                        onClick={() => updateCount(Math.min(20, count + 1))}
                    >+</button>
                </div>

                <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {names.map((name, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono w-6 text-right">{index + 1}.</span>
                            <input
                                value={name}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder={`Player ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="w-full py-4 bg-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    onClick={() => startGame(names)}
                >
                    <Play size={24} fill="currentColor" />
                    Start Game
                </button>
            </div>
        </div>
    );
};

export default SetupScreen;
