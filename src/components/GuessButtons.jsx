import React from 'react';

export default function GuessButtons({ 
  onGuess, 
  selectedCard, 
  disabled, 
  loading 
}) {
  const isDisabled = disabled || selectedCard === null || loading;

  return (
    <div className="guess-buttons">
      <button
        className="button button-higher"
        onClick={() => onGuess('higher')}
        disabled={isDisabled}
      >
        {loading ? 'Processing...' : 'Higher'}
      </button>
      <button
        className="button button-lower"
        onClick={() => onGuess('lower')}
        disabled={isDisabled}
      >
        {loading ? 'Processing...' : 'Lower'}
      </button>
    </div>
  );
}
