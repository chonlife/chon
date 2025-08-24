import React from 'react';
import { Question, QuestionnaireType } from './questionnaires';
import { StoredAnswer } from './PersonalityTest';
import CountryAutocomplete from './CountryAutocomplete';
import ChildrenCountDropdown from './ChildrenCountDropdown';
import BirthWeightInput from './BirthWeightInput';

interface QuestionBlockProps {
  question: Question;
  currentAnswer: StoredAnswer | undefined;
  language: string;
  identity: QuestionnaireType | null;
  workedInCorporate: boolean;
  onMultipleChoice: (question: Question, optionId: string) => void;
  onTextInput: (question: Question, value: string) => void;
  onScale: (question: Question, value: string, identity: QuestionnaireType | null) => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({
  question,
  currentAnswer,
  language,
  identity,
  workedInCorporate,
  onMultipleChoice,
  onTextInput,
  onScale,
}) => {
  // Special handling for country autocomplete on question id 3
  const isCountryQuestion = question.id === 3 && question.type === 'text-input';
  // Special handling for children count dropdown on question id 52
  const isChildrenCountQuestion = question.id === 52 && question.type === 'text-input';
  // Special handling for birth weight input on question id 54
  const isBirthWeightQuestion = question.id === 54 && question.type === 'text-input';

  return (
    <div id={`question-${question.id}`} className="question-container">
      <h2 className="question-text">
        {(() => {
          const qAny: any = question as any;
          // For corporate-only identity, prefer corporate-specific copy when present
          if (identity === 'corporate' || identity === 'both') {
            return language === 'en'
              ? (qAny.textCorporateEn || question.textEn)
              : (qAny.textCorporateZh || question.textZh);
          }
          // For non-corporate flows, show life variant when not worked in corporate and life copy exists
          return language === 'en'
            ? (!workedInCorporate && qAny.textLifeEn ? qAny.textLifeEn : question.textEn)
            : (!workedInCorporate && qAny.textLifeZh ? qAny.textLifeZh : question.textZh);
        })()}
      </h2>
      {question.type === 'multiple-choice' && (
        <div className="answer-options">
          {question.options?.map(option => (
            <div
              key={option.id}
              className={`answer-option ${Array.isArray(currentAnswer?.value) ? (currentAnswer?.value as string[]).includes(option.id) ? 'selected' : '' : currentAnswer?.value === option.id ? 'selected' : ''}`}
              onClick={() => onMultipleChoice(question, option.id)}
            >
              <p>{option.id}) {language === 'en' ? option.textEn : option.textZh}</p>
            </div>
          ))}
        </div>
      )}
      {question.type === 'text-input' && !isCountryQuestion && !isChildrenCountQuestion && !isBirthWeightQuestion && (
        <div className="text-input-container">
          <input
            type="text"
            className="text-answer-input"
            value={currentAnswer?.value || ''}
            onChange={e => onTextInput(question, e.target.value)}
            placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
          />
        </div>
      )}
      {isCountryQuestion && (
        <CountryAutocomplete
          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
          onChange={(val) => onTextInput(question, val)}
          language={language}
          placeholder={language === 'en' ? 'Start typing a country or region...' : '输入国家/地区名称...'}
        />
      )}
      {isChildrenCountQuestion && (
        <ChildrenCountDropdown
          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
          onChange={(val) => onTextInput(question, val)}
          language={language}
          placeholder={language === 'en' ? 'Select or type number of children...' : '选择或输入孩子数量...'}
        />
      )}
      {isBirthWeightQuestion && (
        <BirthWeightInput
          value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
          onChange={(val) => onTextInput(question, val)}
          language={language}
          placeholder={language === 'en' ? 'Enter birth weight...' : '输入出生体重...'}
        />
      )}
      {question.type === 'scale-question' && (
        <div className="scale-question-container">
          <div className="scale-labels-wrapper">
            <div className="scale-options">
              {['1', '2', '3', '4', '5'].map(value => (
                <div
                  key={value}
                  className={`scale-option ${currentAnswer?.value === value ? 'selected' : ''}`}
                  onClick={() => onScale(question, value, identity)}
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