# Ride the Bus - React Frontend + Flask Backend

A React-based card game interface for playing Ride the Bus against an AI opponent trained with DQN models.

## Project Structure

```
test-react/
├── backend/
│   ├── app.py                 # Flask server with game API
│   └── requirements.txt        # Python dependencies
├── ridethebus-react/ridethebus/
│   ├── ride_bus.py            # Game logic
│   ├── ride_bus_env.py        # Gym environment
│   ├── ride_bus_model.py      # DQN model
│   ├── ride_bus_duelling_dqn.py # Dueling DQN model
│   ├── ridebus_dqn_model.keras  # Trained AI model
│   └── ...
├── src/
│   ├── components/
│   │   ├── GameContainer.jsx  # Main game orchestrator
│   │   ├── GameBoard.jsx      # 4x4 card grid
│   │   ├── GuessButtons.jsx   # Higher/Lower buttons
│   │   ├── ScoreDisplay.jsx   # Score info
│   │   └── GameStatus.jsx     # Status messages
│   ├── App.jsx                # Updated to use GameContainer
│   ├── Game.css               # Styling
│   └── ...
└── ...
```

## Setup Instructions

### 1. Backend Setup

Install Python dependencies for the Flask server:

```bash
cd backend
pip install -r requirements.txt
```

**Note**: If you don't have TensorFlow installed globally, this will install it. TensorFlow is large (~1GB+).

### 2. Start Flask Server

Run the Flask backend server:

```bash
cd backend
python app.py
```

You should see output like:
```
✓ Loaded AI model from ...
 * Running on http://127.0.0.1:5000
```

The server will run on `http://localhost:5000` by default.

### 3. Frontend Setup

In a new terminal, from the project root:

```bash
npm install
npm run dev
```

This starts the Vite development server, typically on `http://localhost:5173`.

## API Endpoints

The Flask backend provides these endpoints:

### `POST /game/new`
Initialize a new game
**Response**:
```json
{
  "success": true,
  "board": [...],
  "score": 0,
  "deck_remaining": 36,
  "message": "New game started"
}
```

### `GET /game/state`
Get current game state
**Response**:
```json
{
  "success": true,
  "board": [...],
  "score": 5,
  "deck_remaining": 20,
  "game_over": false
}
```

### `POST /game/move`
Make a move (player guess)
**Body**:
```json
{
  "card_index": 0,
  "guess": "higher"
}
```
**Response**:
```json
{
  "success": true,
  "result": true,
  "correct": true,
  "score": 6,
  "board": [...]
}
```

### `GET /game/ai-move`
Get AI's recommended move (without executing)
**Response**:
```json
{
  "success": true,
  "card_index": 5,
  "guess": "lower",
  "confidence": 0.87
}
```

### `POST /game/ai-play`
Let AI make a move
**Response**:
```json
{
  "success": true,
  "card_index": 5,
  "guess": "lower",
  "result": true,
  "correct": true,
  "score": 6
}
```

## Game Rules

1. **Setup**: 16 cards are dealt on a 4×4 board, 36 remain in deck
2. **Turn**: 
   - Select a card from the board
   - Choose "Higher" or "Lower"
   - A new card is drawn and compared to your selection
3. **Scoring**: Each correct guess increases your streak
4. **Win**: Longer streaks = better score
5. **End**: Game ends when the deck is exhausted

## Features

- **Player vs AI**: Play against a trained Deep Q-Network model
- **AI Hints**: Get the AI's recommendation with confidence score
- **AI Play**: Let the AI take over for a turn
- **Real-time Feedback**: Instant feedback on correct/incorrect guesses
- **Responsive Design**: Works on desktop and mobile

## Customization

### Styling

Edit `src/Game.css` to customize the look and feel:
- Colors and gradients
- Card layout and spacing
- Button styles
- Animations

### AI Model

To use the Dueling DQN model instead:
1. Edit `backend/app.py`
2. Change the model path from `ridebus_dqn_model.keras` to `ridebus_dueling_dqn_model.keras`

### Game Logic

Modify game rules by editing Python files in `ridethebus-react/ridethebus/`:
- `ride_bus.py` - Core game logic
- `ride_bus_env.py` - Game environment for training

## Troubleshooting

### "Model not found" error
Make sure TensorFlow can find the `.keras` files in:
`ridethebus-react/ridethebus/ridebus_dqn_model.keras`

### CORS errors
The Flask server has CORS enabled for `localhost`. If running on different ports, update:
- Frontend: Check `API_BASE` in `GameContainer.jsx`
- Backend: CORS is configured in `app.py`

### Port conflicts
To run on different ports:
- **Flask**: Edit `app.py` bottom: `app.run(port=5001)`
- **Vite**: `npm run dev -- --port 3000`

## Future Enhancements

- AI vs AI demo mode
- Save game statistics
- Leaderboard
- Multiple AI difficulty levels
- Different card game variants
