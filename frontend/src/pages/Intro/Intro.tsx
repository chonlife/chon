import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './Intro.css';

const Intro = () => {
  const navigate = useNavigate();
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const progress = 65;
  
  const handleOptionClick = (choice: string) => {
    setUserChoice(choice);
  };
  
  const handleBeginTest = () => {
    navigate('/personality-test');
  };
  
  return (
    <div className="intro-container">
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      <div className="intro-content">
        <h1 className="intro-question" 
            dangerouslySetInnerHTML={{ __html: t.intro.question }}>
        </h1>
        
        {!userChoice ? (
          <div className="test-options">
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('yes')}
            >
              {t.intro.yes}
            </button>
            <button 
              className="test-option-button"
              onClick={() => handleOptionClick('no')}
            >
              {t.intro.no}
            </button>
          </div>
        ) : (
          <>
            <div className="progress-container">
              <div className="percentage-labels">
                <span className="agree-label">{t.intro.agree} ({progress}%)</span>
                <span className="disagree-label">{t.intro.disagree} ({100 - progress}%)</span>
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