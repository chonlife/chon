import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

# This is the entry point for Vercel
def handler(request, context):
    return app(request, context)

# For local development
if __name__ == "__main__":
    app.run(debug=True)
