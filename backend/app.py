import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

app = Flask(__name__)
# 修改CORS配置，使用更宽松的设置允许所有请求
CORS(app, origins="*", supports_credentials=True, allow_headers=["Content-Type", "Authorization"])


# Initialize services
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url, supabase_key)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
