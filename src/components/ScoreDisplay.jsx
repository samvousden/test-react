import React from 'react';

export default function ScoreDisplay({ score, deckRemaining, gameOver }) {
  return (
    <div className="score-display">
      <div className="score-box">
        <div className="score-label">Current Streak</div>
        <div className="score-value">{score}</div>
      </div>
      <div className="score-box">
        <div className="score-label">Cards Remaining</div>
        <div className="score-value">{deckRemaining}</div>
      </div>
      {gameOver && (
        <div className="score-box game-over-indicator">
          <div className="score-label">GAME OVER</div>
        </div>
      )}
    </div>
  );
}
