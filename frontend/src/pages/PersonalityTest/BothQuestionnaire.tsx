import React from 'react';
import { questionnaires } from './questionnaires';


// 不使用严格的类型检查，改用更宽松的类型以适应所有问题类型
interface QuestionBase {
  id: number;
  type: string;
  textEn: string;
  textZh: string;
  options?: { id: string; textEn: string; textZh: string; }[];
  scaleLabels?: { 
    minEn: string;
    minZh: string;
    maxEn: string;
    maxZh: string;
  };
  tags?: string[];
}

// Define option type to fix 'any' type issues
interface OptionType {
  id: string;
  textEn: string;
  textZh: string;
}

interface BothQuestionnaireProps {
  language: string;
  getCurrentAnswers: () => Record<number, string>;
  handleMultipleChoiceAnswer: (questionId: number, optionId: string) => void;
  handleTextAnswer: (questionId: number, text: string) => void;
  handleScaleAnswer: (questionId: number, value: string) => void;
  showFirstPage: boolean;
  showSecondPage: boolean;
  showThirdPage: boolean;
  showFourthPage: boolean;
  showFifthPage: boolean;
  showSixthPage: boolean;
  setShowFirstPage: (value: boolean) => void;
  setShowSecondPage: (value: boolean) => void;
  setShowThirdPage: (value: boolean) => void;
  setShowFourthPage: (value: boolean) => void;
  setShowFifthPage: (value: boolean) => void;
  setShowSixthPage: (value: boolean) => void;
  scrollToFirstQuestionOfNextPage: () => void;
  calculatedQuestionnaireProgress: () => number;
  finishQuestionnaire: () => void;
}

const BothQuestionnaire: React.FC<BothQuestionnaireProps> = ({
  language,
  getCurrentAnswers,
  handleMultipleChoiceAnswer,
  handleTextAnswer,
  handleScaleAnswer,
  showFirstPage,
  showSecondPage,
  showThirdPage,
  showFourthPage,
  showFifthPage,
  showSixthPage,
  setShowFirstPage,
  setShowSecondPage,
  setShowThirdPage,
  setShowFourthPage,
  setShowFifthPage,
  setShowSixthPage,
  scrollToFirstQuestionOfNextPage,
  calculatedQuestionnaireProgress,
  finishQuestionnaire
}) => {
  // Helper function to render question text
  const renderQuestionText = (question: any) => {
    return (
      <h2 className="question-text">
        {language === 'en' ? question.textEn : question.textZh}
      </h2>
    );
  };
  const bothQuestions = questionnaires.both.questions;
  const page1Questions: any[] = bothQuestions.slice(0, 7); 
  const page2Questions: any[] = bothQuestions.slice(7, 15);
  const page3Questions: any[] = bothQuestions.slice(15, 29);
  const page4Questions: any[] = bothQuestions.slice(29, 41);
  const page5Questions: any[] = bothQuestions.slice(41, 55);
  const page6Questions: any[] = bothQuestions.slice(55, 66);

  return (
    <div className="questionnaire-content both-questionnaire" lang={language}>
      {/* Progress bar */}
      <div className="question-progress-container">
        <div className="question-progress-bar">
          <div 
            className="question-progress-fill" 
            style={{ width: `${calculatedQuestionnaireProgress()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Page 1 - Corporate background */}
      {showFirstPage && (
        <div className="first-page-questions first-page-true">
          {page1Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFirstPage(false);
                setShowSecondPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 1 && parseInt(id) <= 7).length < 7}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 2 - Mother Background */}
      {showSecondPage && (
        <div className="first-page-questions">
          {page2Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowSecondPage(false);
                setShowFirstPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowSecondPage(false);
                setShowThirdPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 8 && parseInt(id) <= 15).length < 8}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 3 - Leadership */}
      {showThirdPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'I. About Your Leadership' 
              : 'I. 关于您的领导力'}
          </h1>
          
          {page3Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowThirdPage(false);
                setShowSecondPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowThirdPage(false);
                setShowFourthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 16 && parseInt(id) <= 29).length < 14}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 4 - Work-Life Balance */}
      {showFourthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'II. About Work-Life Balance' 
              : 'II. 关于工作与生活的平衡'}
          </h1>
          
          {page4Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowFourthPage(false);
                setShowThirdPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFourthPage(false);
                setShowFifthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 30 && parseInt(id) <= 41).length < 12}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 5 - About CHON */}
      {showFifthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'III. About Us, CHON' 
              : 'III. 关于我们'}
          </h1>
          
          {page5Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowFifthPage(false);
                setShowFourthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={() => {
                setShowFifthPage(false);
                setShowSixthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 42 && parseInt(id) <= 55).length < 14}
            >
              {language === 'en' ? 'Continue' : '继续'}
            </button>
          </div>
        </div>
      )}

      {/* Page 6 - About Motherhood */}
      {showSixthPage && (
        <div className="first-page-questions">
          <h1 className="section-title">
            {language === 'en' 
              ? 'IV. About Motherhood' 
              : 'IV. 关于母亲'}
          </h1>
          
          {page6Questions.map((question) => (
            <div key={question.id} id={`question-${question.id}`} className="question-container">
              {renderQuestionText(question)}
              
              {question.type === 'multiple-choice' && (
                <div className="answer-options">
                  {question.options?.map((option: OptionType) => (
                    <div 
                      key={option.id}
                      className={`answer-option ${getCurrentAnswers()[question.id] === option.id ? 'selected' : ''}`}
                      onClick={() => handleMultipleChoiceAnswer(question.id, option.id)}
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
                    value={getCurrentAnswers()[question.id] || ''}
                    onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                    placeholder={language === 'en' ? 'Enter your answer here' : '在此输入您的答案'}
                  />
                </div>
              )}
              
              {question.type === 'scale-question' && (
                <div className="scale-question-container">
                  <div className="scale-labels-wrapper">
                    <div className="scale-options">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <div 
                          key={value}
                          className={`scale-option ${getCurrentAnswers()[question.id] === value ? 'selected' : ''}`}
                          onClick={() => handleScaleAnswer(question.id, value)}
                        >
                          <div className="scale-circle"></div>
                          <span className="scale-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="scale-extreme-labels">
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.minEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.minZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                      <span className="scale-extreme-label">
                        {language === 'en' 
                          ? question.scaleLabels?.maxEn.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>) 
                          : question.scaleLabels?.maxZh.split(' – ').map((part: string, i: number) => <span key={i}>{part}</span>)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="question-navigation">
            <button 
              className="nav-button prev-button"
              onClick={() => {
                setShowSixthPage(false);
                setShowFifthPage(true);
                setTimeout(scrollToFirstQuestionOfNextPage, 100);
              }}
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
            
            <button 
              className="nav-button finish-button"
              onClick={() => {
                finishQuestionnaire();
              }}
              disabled={Object.keys(getCurrentAnswers()).filter(id => parseInt(id) >= 56 && parseInt(id) <= 66).length < 11}
            >
              {language === 'en' ? 'Finish' : '完成'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BothQuestionnaire; 