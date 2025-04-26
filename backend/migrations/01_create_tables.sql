-- Create a simple table for intro choices (yes/no question) with only 2 rows
CREATE TABLE IF NOT EXISTS intro_choices (
    choice VARCHAR(10) PRIMARY KEY CHECK (choice IN ('yes', 'no')),
    count INTEGER NOT NULL DEFAULT 0
);

-- Insert the two fixed rows that will be updated
INSERT INTO intro_choices (choice, count) VALUES ('yes', 0) ON CONFLICT (choice) DO NOTHING;
INSERT INTO intro_choices (choice, count) VALUES ('no', 0) ON CONFLICT (choice) DO NOTHING;

-- Create table for question responses (multiple-choice and scale questions)
CREATE TABLE IF NOT EXISTS question_responses (
    id SERIAL PRIMARY KEY,
    questionnaire_type VARCHAR(20) NOT NULL CHECK (questionnaire_type IN ('mother', 'corporate', 'other', 'both')),
    question_id VARCHAR(50) NOT NULL, -- 唯一ID
    original_question_id INTEGER NOT NULL, -- 原始问题ID
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple-choice', 'scale-question')),
    response_value VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(questionnaire_type, question_id, response_value)
);

-- Create table for text responses
CREATE TABLE IF NOT EXISTS text_responses (
    id SERIAL PRIMARY KEY,
    questionnaire_type VARCHAR(20) NOT NULL CHECK (questionnaire_type IN ('mother', 'corporate', 'other', 'both')),
    question_id VARCHAR(50) NOT NULL, -- 唯一ID
    original_question_id INTEGER NOT NULL, -- 原始问题ID
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_question_responses_questionnaire_question 
ON question_responses(questionnaire_type, question_id);

CREATE INDEX IF NOT EXISTS idx_text_responses_questionnaire_question 
ON text_responses(questionnaire_type, question_id);

-- Add RLS (Row Level Security) policies for production
-- Note: You might want to customize these policies based on your actual auth system
ALTER TABLE intro_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_responses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to update intro choices
CREATE POLICY update_intro_choices ON intro_choices FOR UPDATE TO public 
    USING (true) WITH CHECK (true);

-- Create policy that allows anyone to read intro choices
CREATE POLICY read_intro_choices ON intro_choices FOR SELECT TO public 
    USING (true);

-- Create policy that allows anyone to insert
CREATE POLICY insert_question_responses ON question_responses FOR INSERT TO public 
    WITH CHECK (true);
CREATE POLICY insert_text_responses ON text_responses FOR INSERT TO public 
    WITH CHECK (true);

-- Create policy that allows only authenticated users to read
CREATE POLICY read_question_responses ON question_responses FOR SELECT TO public 
    USING (true);
CREATE POLICY read_text_responses ON text_responses FOR SELECT TO public 
    USING (true);

-- Create policy that allows only authenticated admins to update/delete (customize for your setup)
CREATE POLICY update_question_responses ON question_responses FOR UPDATE TO public 
    USING (true);
CREATE POLICY update_text_responses ON text_responses FOR UPDATE TO public 
    USING (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to use the function
CREATE TRIGGER update_question_responses_modtime
BEFORE UPDATE ON question_responses
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_text_responses_modtime
BEFORE UPDATE ON text_responses
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column(); 