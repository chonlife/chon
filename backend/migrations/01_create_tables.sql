-- Create a simple table for intro choices (yes/no question) with user tracking
CREATE TABLE IF NOT EXISTS intro_choices (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    choice VARCHAR(10) CHECK (choice IN ('yes', 'no')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create table for questionnaire submissions
CREATE TABLE IF NOT EXISTS questionnaire_submissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    questionnaire_type VARCHAR(20) NOT NULL CHECK (questionnaire_type IN ('mother', 'corporate', 'other', 'both')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for individual answers within a submission
CREATE TABLE IF NOT EXISTS question_answers (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES questionnaire_submissions(id),
    question_id INTEGER NOT NULL,
    response_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_intro_choices_user_id 
ON intro_choices(user_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_submissions_user_id 
ON questionnaire_submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_question_answers_submission 
ON question_answers(submission_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE intro_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anyone to insert
CREATE POLICY insert_intro_choices ON intro_choices FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY insert_questionnaire_submissions ON questionnaire_submissions FOR INSERT TO public 
    WITH CHECK (true);

CREATE POLICY insert_question_answers ON question_answers FOR INSERT TO public 
    WITH CHECK (true);

-- Create policies that allow reading own data
CREATE POLICY read_intro_choices ON intro_choices FOR SELECT TO public 
    USING (true);

CREATE POLICY read_questionnaire_submissions ON questionnaire_submissions FOR SELECT TO public 
    USING (true);

CREATE POLICY read_question_answers ON question_answers FOR SELECT TO public 
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
CREATE TRIGGER update_questionnaire_submissions_modtime
    BEFORE UPDATE ON questionnaire_submissions
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_question_answers_modtime
    BEFORE UPDATE ON question_answers
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column(); 