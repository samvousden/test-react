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

# Create Lambda handler with Mangum, disable lifespan for WSGI compatibility
# Create it once at module level to avoid recreating it on each invocation
mangum_handler = Mangum(asgi_app, lifespan="off")

def handler(event, context):
    """Lambda handler that delegates to Mangum"""
    print(f"=== Raw API Gateway Event ===")
    print(f"Method: {event.get('requestContext', {}).get('http', {}).get('method', event.get('httpMethod', 'UNKNOWN'))}")
    print(f"Path: {event.get('rawPath', event.get('path', 'UNKNOWN'))}")
    print(f"Body (from event): {event.get('body', 'EMPTY')}")
    print(f"IsBase64Encoded: {event.get('isBase64Encoded', False)}")
    print(f"Headers: {event.get('headers', {})}")
    print(f"=== End Event Debug ===")
    
    # Call Mangum handler
    return mangum_handler(event, context)


