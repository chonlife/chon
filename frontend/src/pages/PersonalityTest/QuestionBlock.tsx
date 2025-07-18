import React from 'react';
import { Question } from './questionnaires';

interface QuestionBlockProps {
  question: Question;
  currentAnswer: string | undefined;
  language: string;
  onMultipleChoice: (questionId: number, optionId: string) => void;
  onTextInput: (questionId: number, value: string) => void;
  onScale: (questionId: number, value: string) => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  currentAnswer,
  language,
  onMultipleChoice,
  onTextInput,
  onScale,
}) => {
  return (
    <div id={`question-${question.id}`} className="question-container">
      <h2 className="question-text">
        {language === 'en' ? question.textEn : question.textZh}
      </h2>
      {question.type === 'multiple-choice' && (
        <div className="answer-options">
          {question.options?.map(option => (
            <div
              key={option.id}
              className={`answer-option ${currentAnswer === option.id ? 'selected' : ''}`}
              onClick={() => onMultipleChoice(question.id, option.id)}
            >
              <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
            </div>
          ))}
        </div>
      )}
      {question.type === 'text-input' && (
        <div className="text-input-container">
          <input
            type="text"
            className="text-answer-input"
            value={currentAnswer || ''}
            onChange={e => onTextInput(question.id, e.target.value)}
            placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
          />
        </div>
      )}
      {question.type === 'scale-question' && (
        <div className="scale-question-container">
          <div className="scale-labels-wrapper">
            <div className="scale-options">
              {['1', '2', '3', '4', '5'].map(value => (
                <div
                  key={value}
                  className={`scale-option ${currentAnswer === value ? 'selected' : ''}`}
                  onClick={() => onScale(question.id, value)}
                >
                  <div className="scale-circle"></div>
                  <span className="scale-value">{value}</span>
                </div>
              ))}
            </div>
            <div className="scale-extreme-labels">
              <span className="scale-extreme-label">
                {language === 'en'
                  ? question.scaleLabels?.minEn.split(' – ').map((part, i) => <span key={i}>{part}</span>)
                  : question.scaleLabels?.minZh.split(' – ').map((part, i) => <span key={i}>{part}</span>)}
              </span>
              <span className="scale-extreme-label">
                {language === 'en'
                  ? question.scaleLabels?.maxEn.split(' – ').map((part, i) => <span key={i}>{part}</span>)
                  : question.scaleLabels?.maxZh.split(' – ').map((part, i) => <span key={i}>{part}</span>)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBlock; 