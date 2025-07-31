import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS to allow all requests
CORS(app, origins="*", supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase = create_client(supabase_url, supabase_key)

@app.route('/')
def index():
    return jsonify({"message": "CHON Personality Test API"})

@app.route('/api/intro-choice', methods=['POST'])
def update_intro_choice():
    """
    Save user's intro choice
    Expects JSON: {
        "user_id": "chon_timestamp_random",
        "choice": "yes" or "no"
    }
    """
    data = request.get_json()
    
    if 'choice' not in data or 'user_id' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    choice = data['choice']
    user_id = data['user_id']
    
    if choice not in ['yes', 'no']:
        return jsonify({'error': 'Invalid choice. Must be "yes" or "no"'}), 400
    
    try:
        # Insert or update the user's choice
        supabase.table('intro_choices').upsert({
            'user_id': user_id,
            'choice': choice
        }).execute()
        
        return jsonify({'success': True, 'message': f'Successfully saved choice for user {user_id}'})
    
    except Exception as e:
        print(f"Error saving intro choice: {e}")
        return jsonify({'error': str(e)}), 500

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

@app.route('/api/batch-question-responses', methods=['POST'])
def batch_save_question_responses():
    """
    Save all responses for a questionnaire submission
    Expects JSON: {
        "user_id": "chon_timestamp_random",
        "type": "mother/corporate/other/both",
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
        # Create the questionnaire submission
        submission_response = supabase.table('questionnaire_submissions').insert({
            'user_id': data['user_id'],
            'questionnaire_type': data['type']
        }).execute()
        
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
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
