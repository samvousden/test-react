"""
Flask backend for Ride the Bus game.
Provides REST API for React frontend to play against AI.
"""

import sys
import os
import random
from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    from ride_bus import RideTheBus
except ImportError as e:
    print(f"Import error: {e}")
    print("Please ensure ride_bus dependencies are installed")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Global game state
game_state = None

def load_ai_model():
    """Simple AI - no model loading needed"""
    print("✓ Simple AI initialized")
    return True

def get_board_state():
    """Convert game board to readable format"""
    if game_state is None:
        return None
    
    card_symbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    board = []
    for card in game_state.board:
        card_val = game_state.cardvals.get(card[0], 0)
        board.append({
            'symbol': card[0],
            'value': card_val,
            'suit': card[1] if len(card) > 1 else 'unknown'
        })
    return board

def get_ai_action():
    """Simple AI: randomly choose higher/lower with slight bias toward higher"""
    # Simple strategy: 55% chance to guess higher, 45% lower
    card_idx = random.randint(0, 15)  # Random card
    guess = "higher" if random.random() < 0.55 else "lower"
    
    return {
        'card_index': int(card_idx),
        'guess': guess,
        'confidence': 0.5  # Fixed confidence for simple AI
    }

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'ai_available': True
    })

@app.route('/game/new', methods=['POST'])
def new_game():
    """Initialize a new game"""
    global game_state
    try:
        game_state = RideTheBus()
        board = get_board_state()
        
        return jsonify({
            'success': True,
            'board': board,
            'score': 0,
            'deck_remaining': len(game_state.deck),
            'message': 'New game started'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/game/state', methods=['GET'])
def game_state_endpoint():
    """Get current game state"""
    if game_state is None:
        return jsonify({'success': False, 'error': 'No active game'}), 400
    
    try:
        board = get_board_state()
        return jsonify({
            'success': True,
            'board': board,
            'score': game_state.score,
            'deck_remaining': len(game_state.deck),
            'game_over': len(game_state.deck) == 0,
            'message': 'Game state retrieved'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/game/move', methods=['POST'])
def make_move():
    """Make a move in the game"""
    if game_state is None:
        return jsonify({'success': False, 'error': 'No active game'}), 400
    
    try:
        data = request.get_json()
        card_index = data.get('card_index')
        guess = data.get('guess')  # "higher" or "lower"
        
        if card_index is None or guess is None:
            return jsonify({'success': False, 'error': 'Missing card_index or guess'}), 400
        
        if card_index < 0 or card_index >= 16:
            return jsonify({'success': False, 'error': 'Invalid card index'}), 400
        
        if guess not in ['higher', 'lower']:
            return jsonify({'success': False, 'error': 'Guess must be "higher" or "lower"'}), 400
        
        # Get card before move
        selected_card = game_state.board[card_index]
        selected_card_symbol = selected_card[0]
        
        # Make the move
        result = game_state.input_guess(selected_card, guess)
        
        # Get new board state
        board = get_board_state()
        
        return jsonify({
            'success': True,
            'result': result,
            'selected_card': selected_card_symbol,
            'correct': result,
            'score': game_state.score,
            'deck_remaining': len(game_state.deck),
            'game_over': len(game_state.deck) == 0,
            'board': board,
            'message': 'Correct guess!' if result else 'Wrong guess!'
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/game/ai-move', methods=['GET'])
def ai_recommended_move():
    """Get AI's recommended move - DISABLED FOR NOW"""
    return jsonify({'success': False, 'error': 'AI functionality disabled for testing'}), 503

@app.route('/game/ai-play', methods=['POST'])
def ai_plays_move():
    """Let AI make a move - DISABLED FOR NOW"""
    return jsonify({'success': False, 'error': 'AI functionality disabled for testing'}), 503

if __name__ == '__main__':
    # Load AI model on startup
    load_ai_model()
    
    # Run Flask app
    app.run(debug=True, port=5000, host='127.0.0.1')
