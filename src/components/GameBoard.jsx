import React from 'react';

export default function GameBoard({ board, onCardSelect, selectedCard, disabled }) {
  if (!board || board.length === 0) {
    return <div className="game-board">Loading board...</div>;
  }

  return (
    <div className="game-board">
      {board.map((card, index) => (
        <div
          key={index}
          className={`card ${selectedCard === index ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && onCardSelect(index)}
        >
          <div className="card-content">
            <div className="card-symbol">{card.symbol}</div>
            <div className="card-suit">{card.suit}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
