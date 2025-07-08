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
    Update the count for the intro question (yes/no choice)
    Expects JSON: {"choice": "yes"} or {"choice": "no"}
    """
    data = request.get_json()
    choice = data.get('choice')
    
    if choice not in ['yes', 'no']:
        return jsonify({'error': 'Invalid choice. Must be "yes" or "no"'}), 400
    
    try:
        # 使用SQL更新计数，确保原子性
        supabase.table('intro_choices').update({"count": supabase.table('intro_choices').select('count').eq('choice', choice).execute().data[0]['count'] + 1}).eq('choice', choice).execute()
        
        return jsonify({'success': True, 'message': f'Successfully incremented count for {choice}'})
    
    except Exception as e:
        print(f"Error updating intro choice: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/intro-stats', methods=['GET'])
def get_intro_stats():
    """
    获取intro choices统计数据
    返回yes和no的计数以及yes的百分比
    """
    try:
        # 从Supabase获取intro_choices表中的数据
        response = supabase.table('intro_choices').select('*').execute()
        
        # 解析数据
        choices_data = response.data
        
        # 初始化计数
        yes_count = 0
        no_count = 0
        
        # 提取yes和no的计数
        for item in choices_data:
            if item['choice'] == 'yes':
                yes_count = item['count']
            elif item['choice'] == 'no':
                no_count = item['count']
        
        # 计算总数和百分比
        total = yes_count + no_count
        yes_percentage = round((yes_count / total) * 100) if total > 0 else 50  # 默认50%
        
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
            'yes_percentage': 50,  # 默认50%
            'error': str(e)
        }), 500

@app.route('/api/question-response', methods=['POST'])
def store_question_response():
    """
    Store a response for a questionnaire question
    Expects JSON: {
        "questionnaire_type": "mother/corporate/other/both",
        "question_id": 1,     # 可以是数字或字符串
        "original_question_id": 1,  # 原始问题ID
        "question_type": "multiple-choice/scale-question/text-input",
        "response_value": "A" or "1" or "text response"
    }
    """
    data = request.json
    
    # Validate required fields
    required_fields = ['questionnaire_type', 'question_id', 'original_question_id', 'question_type', 'response_value']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    
    # Extract data
    questionnaire_type = data['questionnaire_type']
    question_id = str(data['question_id'])  # 确保以字符串形式存储
    original_question_id = int(data['original_question_id'])  # 原始问题ID
    question_type = data['question_type']
    response_value = data['response_value']
    
    try:
        # For scale questions and multiple choice, we track counts
        if question_type in ['scale-question', 'multiple-choice']:
            # Check if record exists
            result = supabase.table('question_responses').select('*').eq('questionnaire_type', questionnaire_type).eq('question_id', question_id).eq('response_value', response_value).execute()
            
            if result.data:
                # Update existing record
                count = result.data[0]['count'] + 1
                supabase.table('question_responses').update({'count': count}).eq('id', result.data[0]['id']).execute()
            else:
                # Insert new record
                supabase.table('question_responses').insert({
                    'questionnaire_type': questionnaire_type,
                    'question_id': question_id,
                    'original_question_id': original_question_id,
                    'question_type': question_type,
                    'response_value': response_value,
                    'count': 1
                }).execute()
                
            return jsonify({"message": "Question response stored successfully"}), 200
        
        # For text inputs, we just store each response (no counts)
        elif question_type == 'text-input':
            supabase.table('text_responses').insert({
                'questionnaire_type': questionnaire_type,
                'question_id': question_id,
                'original_question_id': original_question_id,
                'response_text': response_value
            }).execute()
            
            return jsonify({"message": "Text response stored successfully"}), 200
        
        else:
            return jsonify({"error": f"Invalid question type: {question_type}"}), 400
    
    except Exception as e:
        print(f"Error storing question response: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/batch-question-responses', methods=['POST'])
def batch_save_question_responses():
    """
    批量保存问卷回答
    期望的JSON格式:
    {
        "responses": [
            {
                "questionnaire_type": "mother",
                "question_id": 1,     # 唯一ID，可以是数字或字符串
                "original_question_id": 1,  # 原始问题ID
                "question_type": "multiple-choice",
                "response_value": "A"
            },
            ... 更多回答 ...
        ]
    }
    """
    data = request.get_json()
    responses = data.get('responses', [])
    
    if not responses:
        return jsonify({'error': 'No responses provided'}), 400
    
    try:
        # 使用Supabase批量插入
        for response in responses:
            # 确保question_id以字符串形式存储
            question_id = str(response.get('question_id'))
            original_question_id = int(response.get('original_question_id'))
            
            supabase.table('question_responses').insert({
                'questionnaire_type': response.get('questionnaire_type'),
                'question_id': question_id,
                'original_question_id': original_question_id,
                'question_type': response.get('question_type'),
                'response_value': response.get('response_value')
            }).execute()
        
        return jsonify({
            'success': True,
            'message': f'Successfully saved {len(responses)} responses',
            'count': len(responses)
        })
    
    except Exception as e:
        print(f"Error saving batch responses: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-question-stats', methods=['GET'])
def get_question_stats():
    """
    Get statistics for a specific question
    Query parameters:
    - questionnaire_type: mother/corporate/other/both
    - question_id: number or string (唯一ID)
    - original_question_id: number (可选，原始问题ID)
    """
    questionnaire_type = request.args.get('questionnaire_type')
    question_id = request.args.get('question_id')
    original_question_id = request.args.get('original_question_id')
    
    if not questionnaire_type:
        return jsonify({"error": "Missing required parameter: questionnaire_type"}), 400
    
    if not question_id and not original_question_id:
        return jsonify({"error": "Missing required parameter: either question_id or original_question_id must be provided"}), 400
    
    try:
        # 构建查询
        query = supabase.table('question_responses').select('*').eq('questionnaire_type', questionnaire_type)
        
        # 根据提供的ID类型进行查询
        if question_id:
            query = query.eq('question_id', question_id)
        elif original_question_id:
            query = query.eq('original_question_id', int(original_question_id))
            
        result = query.execute()
            
        return jsonify({"data": result.data}), 200
    except Exception as e:
        print(f"Error retrieving question stats: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
