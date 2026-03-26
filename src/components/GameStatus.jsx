import React from 'react';

export default function GameStatus({ 
  lastResult, 
  lastMove, 
  isLoading, 
  error 
}) {
  return (
    <div className="game-status">
      {error && (
        <div className="status-message error">
          ❌ {error}
        </div>
      )}
      
      {isLoading && (
        <div className="status-message loading">
          ⏳ Processing...
        </div>
      )}
      
      {lastResult !== null && !isLoading && (
        <div className={`status-message ${lastResult ? 'correct' : 'incorrect'}`}>
          {lastResult ? (
            <>
              ✓ Correct! Card: {lastMove.selectedCard}
            </>
          ) : (
            <>
              ✗ Incorrect! Card: {lastMove.selectedCard}
            </>
          )}
        </div>
      )}
      
      {lastResult === null && !isLoading && !error && (
        <div className="status-message neutral">
          Select a card to begin
        </div>
      )}
    </div>
  );
}
