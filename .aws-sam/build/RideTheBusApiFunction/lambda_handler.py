"""
AWS Lambda handler for Ride the Bus Flask app.
Converts Flask WSGI app to Lambda-compatible format using Mangum and asgiref.
"""

# Import the Flask app
from app import app

# Use asgiref to convert WSGI to ASGI
from asgiref.wsgi import WsgiToAsgi
from mangum import Mangum

# Create ASGI wrapper around Flask WSGI app
asgi_app = WsgiToAsgi(app)

# Create Lambda handler with Mangum
handler = Mangum(asgi_app)
