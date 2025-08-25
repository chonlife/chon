import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../PersonalityTest.css';

interface IntroSectionProps {
  userIntroChoice: string | null;
  introStats: {
    yesCount: number;
    noCount: number;
    yesPercentage: number;
  };
  hasCompletedQuestionnaire: () => boolean;
  hasInProgressQuestionnaire: () => boolean;
  onOptionClick: (choice: string) => void;
  onBeginTest: () => void;
  onContinueTest: () => void;
  onClearTestData: () => void;
  onSetResultsStep: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  userIntroChoice,
  introStats,
  hasCompletedQuestionnaire,
  hasInProgressQuestionnaire,
  onOptionClick,
  onBeginTest,
  onContinueTest,
  onClearTestData,
  onSetResultsStep
}) => {
  const { t, language } = useLanguage();
  
  const wrappedQuestion = `<span lang="${language}">${language === 'en' ? t.intro.question : '母亲是天生的领导者。'}</span>`;
  
  return (
    <div className="intro-content" lang={language}>
      <h1 className="intro-question" 
          dangerouslySetInnerHTML={{ __html: wrappedQuestion }}
          lang={language}>
      </h1>
      
      {!userIntroChoice ? (
        <div className="test-options" lang={language}>
          <button 
            className="test-option-button"
            onClick={() => onOptionClick('yes')}
            lang={language}
          >
            {t.intro.yes}
          </button>
          <button 
            className="test-option-button"
            onClick={() => onOptionClick('no')}
            lang={language}
          >
            {t.intro.no}
          </button>
        </div>
      ) : (
        <>
          <div className="progress-container" lang={language}>
            <div className="percentage-labels" lang={language}>
              <span className="agree-label" lang={language}>
                {t.intro.agree} ({introStats.yesPercentage}%)
              </span>
              <span className="disagree-label" lang={language}>
                {t.intro.disagree} ({100 - introStats.yesPercentage}%)
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${introStats.yesPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="test-buttons">
            {hasCompletedQuestionnaire() ? (
              <>
                <button 
                  className="begin-test-button" 
                  onClick={onSetResultsStep}
                  lang={language}
                >
                  {t.intro.viewResult}
                </button>
                <button 
                  className="restart-test-button" 
                  onClick={onClearTestData}
                  lang={language}
                >
                  {t.intro.restartTest}
                </button>
              </>
            ) : hasInProgressQuestionnaire() ? (
              <>
                <button 
                  className="begin-test-button" 
                  onClick={onContinueTest}
                  lang={language}
                >
                  {t.intro.continueTest}
                </button>
                <button 
                  className="restart-test-button" 
                  onClick={onClearTestData}
                  lang={language}
                >
                  {t.intro.restartTest}
                </button>
              </>
            ) : (
              <button 
                className="begin-test-button" 
                onClick={onBeginTest}
                lang={language}
              >
                {t.intro.beginTest}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default IntroSection; 