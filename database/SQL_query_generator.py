import json

# 读取你的本地mapping.json
with open('/Users/jinhonglin/Desktop/chon/database/question_mapping.json', 'r') as f:
    mapping = json.load(f)

# 生成插入语句
insert_sql = "INSERT INTO question_identity_mapping (questionnaire_type, question_id, unique_question_id) VALUES\n"

values = []
for key, unique_id in mapping.items():
    questionnaire_type, question_id = key.split(":")
    values.append(f"('{questionnaire_type}', {int(question_id)}, {unique_id})")

insert_sql += ",\n".join(values) + ";"

# 打印出来
print(insert_sql)
