import json

# 读取你的 all_questionnaires.json
with open('/Users/jinhonglin/Desktop/chon/output.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

# 建立映射表
text_to_uid = {}  # textEn -> unique id
uid_to_question = {}  # unique id -> question content
mapping = {}  # (group, question id) -> unique id

uid_counter = 1

# 遍历每个问卷
for group_name, group_data in all_data.items():
    questions = group_data.get('questions', [])
    for q in questions:
        text_en = q.get('textEn')
        if not text_en:
            continue  # 没有 textEn 的跳过

        # 如果这个内容没有遇到过，给它分配一个新的 unique id
        if text_en not in text_to_uid:
            text_to_uid[text_en] = uid_counter
            uid_to_question[uid_counter] = q
            uid_counter += 1

        # 记录 mapping
        original_id = q.get('id')
        mapping_key = f"{group_name}:{original_id}"
        mapping[mapping_key] = text_to_uid[text_en]

# 保存 unique_questions.json
with open('unique_questions.json', 'w', encoding='utf-8') as f:
    json.dump(uid_to_question, f, ensure_ascii=False, indent=2)

# 保存 question_mapping.json
with open('question_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print("✅ Done! 已生成 unique_questions.json 和 question_mapping.json")
