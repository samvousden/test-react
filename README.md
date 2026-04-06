# Ride The Bus - React + Flask

Interactive Ride the Bus game with a React frontend and Flask backend API.

## Overview

This project includes:

- A Vite + React client for playing the game.
- A Flask API that manages game state and move validation.
- AWS SAM infrastructure for deploying the backend to Lambda + API Gateway.
- Supporting reinforcement-learning experiments in `ridethebus-react/ridethebus`.

## Tech Stack

- Frontend: React 19, Vite 8
- Backend: Flask, Flask-CORS
- Serverless runtime: AWS Lambda (Mangum + WsgiToAsgi)
- Infra: AWS SAM / CloudFormation

## Project Structure

```
.
|- src/                        # React app
|- backend/
|  |- app.py                   # Flask API
|  |- lambda_handler.py        # Lambda entrypoint
|  |- requirements.txt         # Python dependencies
|  |- ride_bus.py              # Game engine
|- template.yaml               # AWS SAM template
|- samconfig.toml              # SAM deploy defaults
|- amplify.yml                 # Amplify frontend build config
```

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.11+
- pip

Optional (for AWS deployment):

- AWS CLI configured with credentials
- AWS SAM CLI

## Local Development

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

From project root:

```bash
python -m pip install -r backend/requirements.txt
```

### 3. Run the backend API

```bash
python backend/app.py
```

Backend runs at:

- `http://127.0.0.1:5000`

### 4. Run the frontend

In a second terminal:

```bash
npm run dev
```

Frontend runs at:

- `http://localhost:5173`

By default, the frontend calls `http://localhost:5000`.

If needed, override API base URL by creating a `.env` file in the project root:

```env
VITE_API_BASE=https://your-api-url
```

## Available Frontend Scripts

- `npm run dev` - start Vite development server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Backend API

Base URL (local): `http://127.0.0.1:5000`

### Health

- `GET /health`
- Returns API health status.

### Start New Game

- `POST /game/new`
- Creates a new game and returns board, score, and deck count.

### Current Game State

- `GET /game/state`
- Returns active game snapshot.

### Make Move

- `POST /game/move`
- Request body:

```json
{
	"card_index": 3,
	"guess": "higher"
}
```

- `card_index` must be 0-15.
- `guess` must be `"higher"` or `"lower"`.

### AI Endpoints (Current Status)

- `GET /game/ai-move` -> currently returns `503`
- `POST /game/ai-play` -> currently returns `503`

## Deploy Backend with AWS SAM

### Build

```bash
sam build
```

### Deploy

```bash
sam deploy
```

This project already includes defaults in `samconfig.toml`:

- stack name: `ride-the-bus-api`
- region: `us-east-2`
- stage: `prod`

After deployment, use the output API endpoint as `VITE_API_BASE` for the frontend.

## Frontend Hosting (Amplify)

`amplify.yml` is configured to:

- install dependencies with `npm ci`
- run `npm run build`
- publish the `dist/` directory

Set `VITE_API_BASE` in Amplify environment variables to your deployed API URL.

## Notes

- Backend game state is kept in memory for the running process.
- In serverless environments, instance reuse is not guaranteed, so state can reset between invocations.
- The RL model and experimentation scripts are under `ridethebus-react/ridethebus` and are separate from the current API gameplay flow.
