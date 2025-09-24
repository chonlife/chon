import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
import hashlib
import binascii

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS to allow all requests
CORS(app, origins="*", supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
else:
    supabase = None
    print("Warning: Supabase credentials not found")

# Import all the route handlers from your backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Copy all routes from your original app.py here
@app.route('/')
def index():
    return jsonify({"message": "CHON Personality Test API"})

# Ensure CORS headers exist on every response and make preflight expectations explicit
@app.after_request
def apply_cors_headers(response):
    origin = request.headers.get('Origin')
    # Echo back the request origin when present; otherwise allow all
    response.headers['Access-Control-Allow-Origin'] = origin or '*'
    response.headers['Vary'] = 'Origin'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    return response

@app.route('/api/intro-choice', methods=['POST'])
def update_intro_choice():
    """
    Save user's intro choice
    Expects JSON: {
        "user_id": "chon_timestamp_random",
        "choice": "yes" or "no"
    }
    """
    try:
        data = request.get_json()
        
        if 'choice' not in data or 'user_id' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        choice = data['choice']
        user_id = data['user_id']
        
        if choice not in ['yes', 'no']:
            return jsonify({'error': 'Invalid choice. Must be "yes" or "no"'}), 400
        
        try:
            # First try to update
            update_result = supabase.table('intro_choices').update({
                'choice': choice,
                'updated_at': 'NOW()'
            }).eq('user_id', user_id).execute()
            
            # If no rows were updated, do an insert
            if not update_result.data:
                supabase.table('intro_choices').insert({
                    'user_id': user_id,
                    'choice': choice
                }).execute()
            
            return jsonify({
                'success': True,
                'message': f'Successfully saved choice for user {user_id}'
            })
        
        except Exception as e:
            return jsonify({
                'error': str(e),
                'message': 'Failed to save choice. Database operation failed.'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Failed to process request.'
        }), 500

@app.route('/api/intro-stats', methods=['GET'])
def get_intro_stats():
    """
    Get statistics for intro choices
    Returns counts and percentages for yes/no responses
    """
    try:
        # Get all intro choices
        response = supabase.table('intro_choices').select('choice').execute()
        choices = response.data
        
        # Count yes and no responses
        yes_count = sum(1 for choice in choices if choice['choice'] == 'yes')
        no_count = sum(1 for choice in choices if choice['choice'] == 'no')
        total = yes_count + no_count
        
        # Calculate percentage
        yes_percentage = round((yes_count / total) * 100) if total > 0 else 50
        
        return jsonify({
            'yes_count': yes_count,
            'no_count': no_count,
            'total': total,
            'yes_percentage': yes_percentage
        })
    
    except Exception as e:
        print(f"Error getting intro stats: {e}")
        return jsonify({
            'yes_count': 0,
            'no_count': 0,
            'total': 0,
            'yes_percentage': 50,
            'error': str(e)
        }), 500

def _hash_password(password: str, salt: str | None = None):
    """Return (hash_hex, salt_hex) using PBKDF2-HMAC-SHA256."""
    if salt is None:
        salt_bytes = os.urandom(16)
    else:
        salt_bytes = binascii.unhexlify(salt)
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt_bytes, 100_000)
    return binascii.hexlify(hash_bytes).decode('utf-8'), binascii.hexlify(salt_bytes).decode('utf-8')

def _verify_password(password: str, salt_hex: str, expected_hash_hex: str) -> bool:
    try:
        calc_hash_hex, _ = _hash_password(password, salt_hex)
        return calc_hash_hex == expected_hash_hex
    except Exception:
        return False

@app.route('/api/batch-question-responses', methods=['POST'])
def batch_save_question_responses():
    """
    Save all responses for a questionnaire submission
    Expects JSON: {
        "user_id": "chon_timestamp_random",
        "type": "mother/corporate/other/both",
        "corporate_role": "founder/board_member/etc" (optional),
        "answers": [
            {
                "question_id": 1,
                "response_value": "A" or "1" or "text response"
            }
        ]
    }
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['user_id', 'type', 'answers']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({'error': f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    try:
        # Create submission data with optional corporate_role
        submission_data = {
            'user_id': data['user_id'],
            'questionnaire_type': data['type']
        }
        
        # Add corporate_role if provided and type is corporate or both
        if 'corporate_role' in data and data['type'] in ['corporate', 'both']:
            submission_data['corporate_role'] = data['corporate_role']
        
        # Create the questionnaire submission
        submission_response = supabase.table('questionnaire_submissions').insert(
            submission_data
        ).execute()
        
        submission_id = submission_response.data[0]['id']
        
        # Insert all answers
        answers = []
        for answer in data['answers']:
            answers.append({
                'submission_id': submission_id,
                'question_id': answer['question_id'],
                'response_value': answer['response_value']
            })
        
        if answers:
            supabase.table('question_answers').insert(answers).execute()
        
        return jsonify({
            'success': True,
            'message': f'Successfully saved submission for user {data["user_id"]}',
            'submission_id': submission_id
        })
    
    except Exception as e:
        print(f"Error saving batch responses: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    """
    Create a user account linked with questionnaire user_id.
    Expects JSON:
    {
      "user_id": "chon_...",            -- required (to link questionnaire)
      "username": "...",                 -- required
      "password": "...",                 -- required (will be hashed)
      "email": "...",                    -- optional
      "phone_number": "+1 5551234567"    -- optional
    }
    At least one of email or phone_number must be present.
    """
    # Handle CORS preflight explicitly to avoid 4xx/5xx from interfering
    if request.method == 'OPTIONS':
        return ('', 204)

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400

        user_id = data.get('user_id')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        phone = data.get('phone_number')

        if not user_id or not username or not password:
            return jsonify({'error': 'Missing required fields: user_id, username, password'}), 400
        if not email and not phone:
            return jsonify({'error': 'Provide at least one of email or phone_number'}), 400

        # Hash password
        pwd_hash, salt = _hash_password(password)

        # Upsert-like behavior: ensure unique by user_id
        # Try update first
        existing = supabase.table('users').select('id').eq('user_id', user_id).execute()
        if existing.data:
            # Update existing record
            supabase.table('users').update({
                'email': email,
                'phone_number': phone,
                'username': username,
                'password_hash': pwd_hash,
                'password_salt': salt,
            }).eq('user_id', user_id).execute()
        else:
            supabase.table('users').insert({
                'user_id': user_id,
                'email': email,
                'phone_number': phone,
                'username': username,
                'password_hash': pwd_hash,
                'password_salt': salt,
            }).execute()

        return jsonify({'success': True})
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    """
    Authenticate a user by email OR phone_number and password.
    Expects JSON:
    {
      "email": "..." OR "phone_number": "+1 555...",
      "password": "..."
    }
    """
    if request.method == 'OPTIONS':
        return ('', 204)

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON'}), 400

        email = data.get('email')
        phone = data.get('phone_number')
        password = data.get('password')

        if (not email and not phone) or not password:
            return jsonify({'error': 'Provide email or phone_number and password'}), 400

        # Lookup user by email or phone
        if email:
            q = supabase.table('users').select('*').eq('email', email).limit(1).execute()
        else:
            q = supabase.table('users').select('*').eq('phone_number', phone).limit(1).execute()

        user_rows = q.data or []
        if not user_rows:
            return jsonify({'error': 'Invalid credentials'}), 401

        user = user_rows[0]
        if not _verify_password(password, user.get('password_salt', ''), user.get('password_hash', '')):
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({
            'success': True,
            'user': {
                'user_id': user.get('user_id'),
                'username': user.get('username'),
                'email': user.get('email'),
                'phone_number': user.get('phone_number'),
            }
        })
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/user-responses/<user_id>', methods=['GET'])
def get_user_responses(user_id):
    """
    Get all responses for a specific user
    """
    try:
        # Get user's questionnaire submissions
        submissions = supabase.table('questionnaire_submissions').select(
            '*'
        ).eq('user_id', user_id).execute()
        
        results = []
        for submission in submissions.data:
            # Get answers for this submission
            answers = supabase.table('question_answers').select(
                '*'
            ).eq('submission_id', submission['id']).execute()
            
            results.append({
                'submission_id': submission['id'],
                'questionnaire_type': submission['questionnaire_type'],
                'created_at': submission['created_at'],
                'answers': answers.data
            })
        
        return jsonify({
            'user_id': user_id,
            'submissions': results
        })
    
    except Exception as e:
        print(f"Error getting user responses: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
