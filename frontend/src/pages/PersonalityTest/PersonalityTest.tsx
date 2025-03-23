import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector.tsx';
import './PersonalityTest.css';

const PersonalityTest = () => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'intro' | 'identity'>('intro');
  const [userChoice, setUserChoice] = useState<string | null>(null);
  
  const progress = 65;
  
  const handleOptionClick = (choice: string) => {
    setUserChoice(choice);
  };
  
  const handleBeginTest = () => {
    setStep('identity');
  };

  const wrappedQuestion = `<span lang="${language}">${t.intro.question}</span>`;

  return (
    <main className="personality-test-container" lang={language}>
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      {step === 'intro' ? (
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
      ) : (
        <div className="identity-selection" lang={language}>
          <h1 className="identity-title" lang={language}>{t.personalityTest.identity.title}</h1>
          
          <div className="identity-option mother" lang={language}>
            <p lang={language}>{t.personalityTest.identity.mother}</p>
          </div>
          
          <div className="identity-option corporate" lang={language}>
            <p lang={language}>
              {t.personalityTest.identity.corporate.split('\\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < t.personalityTest.identity.corporate.split('\\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
          
          <div className="identity-option both" lang={language}>
            <p lang={language}>{t.personalityTest.identity.both}</p>
          </div>
          
          <div className="identity-option other" lang={language}>
            <p lang={language}>{t.personalityTest.identity.other}</p>
          </div>
        </div>
      )}
      
      <LanguageSelector />
    </main>
  );
};

export default PersonalityTest; 