import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GuessButtons from './GuessButtons';
import ScoreDisplay from './ScoreDisplay';
import GameStatus from './GameStatus';

const API_BASE = 'http://localhost:5000';

export default function GameContainer() {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [deckRemaining, setDeckRemaining] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [aiMode, setAiMode] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setLoading(true);
    setError(null);
    setSelectedCard(null);
    setLastResult(null);
    setLastMove(null);

    try {
      const response = await fetch(`${API_BASE}/game/new`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start new game');
      }

      const data = await response.json();
      setBoard(data.board);
      setScore(data.score);
      setDeckRemaining(data.deck_remaining);
      setGameOver(false);
      setGameStarted(true);
      setAiMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelect = (cardIndex) => {
    if (!gameOver && !loading) {
      setSelectedCard(cardIndex);
      setError(null);
    }
  };

  const handleGuess = async (guess) => {
    if (selectedCard === null || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/game/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_index: selectedCard,
          guess: guess,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to make move');
      }

      const data = await response.json();
      setBoard(data.board);
      setScore(data.score);
      setDeckRemaining(data.deck_remaining);
      setGameOver(data.game_over);
      setLastResult(data.correct);
      setLastMove({
        selectedCard: data.selected_card,
        guess: guess,
      });
      setSelectedCard(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIMove = async () => {
    if (loading || gameOver) return;

    setLoading(true);
    setError(null);
    setAiMode(true);

    try {
      const response = await fetch(`${API_BASE}/game/ai-play`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to get AI move');
      }

      const data = await response.json();
      setBoard(data.board);
      setScore(data.score);
      setDeckRemaining(data.deck_remaining);
      setGameOver(data.game_over);
      setLastResult(data.correct);
      setLastMove({
        selectedCard: `${data.card_index}`,
        guess: data.guess,
      });
      setSelectedCard(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setAiMode(false), 1500);
    }
  };

  const handleGetAIRecommendation = async () => {
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/game/ai-move`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendation');
      }

      const data = await response.json();
      setSelectedCard(data.card_index);
      alert(
        `AI recommends: Card ${data.card_index}, ${data.guess.toUpperCase()}\nConfidence: ${(data.confidence * 100).toFixed(1)}%`
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Ride the Bus</h1>
        <p className="subtitle">Play against the AI</p>
      </header>

      <div className="game-content">
        <div className="main-game">
          <ScoreDisplay
            score={score}
            deckRemaining={deckRemaining}
            gameOver={gameOver}
          />

          <GameBoard
            board={board}
            onCardSelect={handleCardSelect}
            selectedCard={selectedCard}
            disabled={loading || gameOver}
          />

          <GameStatus
            lastResult={lastResult}
            lastMove={lastMove}
            isLoading={loading}
            error={error}
          />

          <GuessButtons
            onGuess={handleGuess}
            selectedCard={selectedCard}
            disabled={gameOver}
            loading={loading}
          />
        </div>

        <div className="controls">
          <button
            className="button button-primary"
            onClick={startNewGame}
            disabled={loading}
          >
            New Game
          </button>

          <button
            className="button button-secondary"
            onClick={handleAIMove}
            disabled={loading || gameOver || selectedCard !== null}
          >
            AI Play
          </button>

          <button
            className="button button-secondary"
            onClick={handleGetAIRecommendation}
            disabled={loading || gameOver || selectedCard === null}
          >
            Get Hint
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button
              className="button button-primary"
              onClick={startNewGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
