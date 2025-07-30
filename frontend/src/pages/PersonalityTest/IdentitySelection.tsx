import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './PersonalityTest.css';

export type IdentityType = 'mother' | 'corporate' | 'both' | 'other';

interface IdentitySelectionProps {
  selectedIdentity: IdentityType | null;
  onIdentitySelect: (identity: IdentityType) => void;
  onContinue: () => void;
}

export default function IdentitySelection({
  selectedIdentity,
  onIdentitySelect,
  onContinue
}: IdentitySelectionProps): React.ReactElement {
  const { t, language } = useLanguage();

  const isIdentitySelected = (identity: IdentityType): boolean => {
    if (selectedIdentity === 'both') {
      return identity === 'mother' || identity === 'corporate';
    }
    return selectedIdentity === identity;
  };

  return (
    <div className="identity-selection" lang={language}>
      <h1 className="identity-title" lang={language}>{t.personalityTest.identity.title}</h1>
      
      <div 
        className={`option-container ${isIdentitySelected('mother') ? 'selected' : ''}`}
        onClick={() => onIdentitySelect('mother')}
      >
        <div 
          className="identity-checkbox" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onIdentitySelect('mother'); 
          }}
        ></div>
        <div 
          className={`identity-option mother ${isIdentitySelected('mother') ? 'selected' : ''}`}
          lang={language}
        >
          <p lang={language}>{t.personalityTest.identity.mother}</p>
        </div>
      </div>
      
      <div 
        className={`option-container ${isIdentitySelected('corporate') ? 'selected' : ''}`}
        onClick={() => onIdentitySelect('corporate')}
      >
        <div 
          className="identity-checkbox" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onIdentitySelect('corporate'); 
          }}
        ></div>
        <div 
          className={`identity-option corporate ${isIdentitySelected('corporate') ? 'selected' : ''}`}
          lang={language}
        >
          <p lang={language}>
            {(language === 'en' 
              ? `Corporate Manager`
              : `企业管理人员`
            ).split('\n').map((line, index, arr) => (
              <React.Fragment key={index}>
                {line}
                {index < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
      
      <div 
        className={`option-container ${isIdentitySelected('other') ? 'selected' : ''}`}
        onClick={() => onIdentitySelect('other')}
      >
        <div 
          className={`identity-option other ${isIdentitySelected('other') ? 'selected' : ''}`}
          lang={language}
        >
          <p lang={language}>{t.personalityTest.identity.other}</p>
        </div>
      </div>

      <button 
        className="continue-button"
        onClick={onContinue}
        disabled={!selectedIdentity}
        lang={language}
      >
        {language === 'en' ? 'CONTINUE →' : '继续 →'}
      </button>
    </div>
  );
}