import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './Intro.css';

const Intro = () => {
  const navigate = useNavigate();
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const { t, language } = useLanguage();
  
  const progress = 65;
  
  const handleOptionClick = (choice: string) => {
    setUserChoice(choice);
  };
  
  const handleBeginTest = () => {
    navigate('/personality-test');
  };
  
  const wrappedQuestion = `<span lang="${language}">${t.intro.question}</span>`;
  
  return (
    <div className="intro-container" lang={language}>
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      <div className="intro-content" lang={language}>
        <h1 className="intro-question" 
            dangerouslySetInnerHTML={{ __html: wrappedQuestion }}
            lang={language}>
        </h1>
        
        {!userChoice ? (
          <div className="test-options" lang={language}>
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('yes')}
              lang={language}
            >
              {t.intro.yes}
            </button>
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('no')}
              lang={language}
            >
              {t.intro.no}
            </button>
          </div>
        ) : (
          <>
            <div className="progress-container" lang={language}>
              <div className="percentage-labels" lang={language}>
                <span className="agree-label" lang={language}>{t.intro.agree} ({progress}%)</span>
                <span className="disagree-label" lang={language}>{t.intro.disagree} ({100 - progress}%)</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              className="begin-test-button" 
              onClick={handleBeginTest}
              lang={language}
            >
              {t.intro.beginTest}
            </button>
          </>
        )}
      </div>
      
      <LanguageSelector />
    </div>
  );
};

export default Intro; 