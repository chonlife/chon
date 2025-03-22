import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) 

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask + Poetry!'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
