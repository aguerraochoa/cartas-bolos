import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';

const AppContent = () => {
  const { gameState } = useGame();

  if (gameState === 'setup') return <SetupScreen />;
  if (gameState === 'playing') return <GameScreen />;
  if (gameState === 'finished') return <ResultsScreen />;

  return <div>Unknown State</div>;
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
