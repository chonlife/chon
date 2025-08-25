import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../PersonalityTest.css';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

interface IntroSectionProps {
  userIntroChoice: string | null;
  onOptionClick: (choice: string) => void;
  onBeginTest: () => void;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  userIntroChoice,
  onOptionClick,
  onBeginTest,
}) => {
  const { t, language } = useLanguage();
  const [introStats, setIntroStats] = useState({
    yesCount: 0,
    noCount: 0,
    yesPercentage: 65
  });

  const fetchIntroStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/intro-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update UI with the stats
      setIntroStats({
        yesCount: data.yes_count,
        noCount: data.no_count,
        yesPercentage: data.yes_percentage
      });
      
    } catch (error) {
      // Keep current stats on error
    }
  };

  // Fetch initial stats when component mounts
  useEffect(() => {
    fetchIntroStats();
  }, []);

  const handleOptionClick = (choice: string) => {
    onOptionClick(choice);
  };
  
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
            <button 
              className="begin-test-button" 
              onClick={onBeginTest}
              lang={language}
            >
              {t.intro.beginTest}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IntroSection; 