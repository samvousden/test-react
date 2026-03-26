"""
AWS Lambda handler for Ride the Bus Flask app.
Converts Flask WSGI app to Lambda-compatible format using Mangum.
"""

import sys
from pathlib import Path

# Add ridethebus path to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent / 'ridethebus-react' / 'ridethebus'))

# Import the Flask app
from app import app

# Use Mangum to convert WSGI to ASGI for Lambda
from mangum import Mangum

# Create Lambda handler
handler = Mangum(app, lifespan="off")
