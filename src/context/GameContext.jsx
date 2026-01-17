import React, { createContext, useContext, useState } from 'react';
import { createDeck, shuffleDeck, evaluateBestHand } from '../utils/poker';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    // Load initial state from local storage or default
    const [gameState, setGameState] = useState(() => {
        const saved = localStorage.getItem('bowling_poker_state');
        return saved ? JSON.parse(saved).gameState : 'setup';
    });

    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem('bowling_poker_state');
        return saved ? JSON.parse(saved).players : [];
    });

    const [deck, setDeck] = useState(() => {
        const saved = localStorage.getItem('bowling_poker_state');
        return saved ? JSON.parse(saved).deck : [];
    });

    const [results, setResults] = useState(() => {
        const saved = localStorage.getItem('bowling_poker_state');
        return saved ? JSON.parse(saved).results : [];
    });

    // Persist state changes
    React.useEffect(() => {
        const stateToSave = { gameState, players, deck, results };
        localStorage.setItem('bowling_poker_state', JSON.stringify(stateToSave));
    }, [gameState, players, deck, results]);

    const startGame = (playerConfig) => {
        const newDeck = shuffleDeck(createDeck());
        const newPlayers = [];

        let playerCount = 4;
        let playerNames = [];

        // Handle both number (legacy) and array of names
        if (typeof playerConfig === 'number') {
            playerCount = playerConfig;
            for (let i = 0; i < playerCount; i++) {
                playerNames.push(`Player ${i + 1}`);
            }
        } else if (Array.isArray(playerConfig)) {
            playerCount = playerConfig.length;
            playerNames = playerConfig;
        }

        // Initialize players
        for (let i = 0; i < playerCount; i++) {
            newPlayers.push({
                id: i + 1,
                name: playerNames[i] || `Player ${i + 1}`,
                cards: []
            });
        }

        // Deal 1 card to each player to start
        newPlayers.forEach(player => {
            if (newDeck.length > 0) {
                player.cards.push(newDeck.pop());
            }
        });

        setDeck(newDeck);
        setPlayers(newPlayers);
        setGameState('playing');
        setResults([]);
    };

    const resetGame = () => {
        setGameState('setup');
        setPlayers([]);
        setDeck([]);
        setResults([]);
        localStorage.removeItem('bowling_poker_state');
    };

    // Refactored drawCard for safety
    const safeDrawCard = (playerId) => {
        if (deck.length === 0) {
            alert("Deck is empty!");
            return;
        }

        const currentDeck = [...deck];
        const card = currentDeck.pop();

        setDeck(currentDeck);
        setPlayers(prev => prev.map(p =>
            p.id === playerId ? { ...p, cards: [...p.cards, card] } : p
        ));
    };

    const removeLastCard = (playerId) => {
        setPlayers(prev => prev.map(p => {
            if (p.id === playerId && p.cards.length > 0) {
                const newCards = [...p.cards];
                newCards.pop(); // Remove the last one
                return { ...p, cards: newCards };
            }
            return p;
        }));
    };

    const finishGame = () => {
        // Calculate results
        const computedResults = players.map(p => {
            const hand = evaluateBestHand(p.cards);
            return {
                ...p,
                hand,
                handDescription: hand ? hand.descr : 'No Hand',
                handRank: hand ? hand.rank : 0
            };
        });

        // Sort by hand strength descending
        // Pokersolver hands have a value property for comparison, or we can use generic sort provided by library?
        // Hand.winners(hands) returns the winning hand(s).
        // But we want to rank 1st, 2nd, 3rd.

        // We can sort using the compare logic: handA.loseTo(handB)
        computedResults.sort((a, b) => {
            if (!a.hand) return 1;
            if (!b.hand) return -1;
            // logic: if a loses to b, b is better (return 1 to put b first? No sort is a-b)
            // standard sort: negative if a < b.
            // We want descending order (best first).
            // if b loses to a => a is better => return -1
            return b.hand.loseTo(a.hand) ? -1 : 1;
        });

        setResults(computedResults);
        setGameState('finished');
    };

    return (
        <GameContext.Provider value={{
            gameState,
            players,
            deck,
            results,
            startGame,
            resetGame,
            drawCard: safeDrawCard,
            removeLastCard,
            finishGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
