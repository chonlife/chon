import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../PersonalityTest.css';

export type IdentityType = 'mother' | 'corporate' | 'both' | 'other';

export type CorporateRole = 
  | 'founder'
  | 'board_member'
  | 'c_suite'
  | 'president'
  | 'managing_director'
  | 'partner'
  | 'vice_president'
  | 'director'
  | 'senior_manager';

interface IdentitySelectionProps {
  selectedIdentity: IdentityType | null;
  selectedRole: CorporateRole | null;
  onIdentitySelect: (identity: IdentityType) => void;
  onRoleSelect: (role: CorporateRole | null) => void;
  onContinue: () => void;
}

const corporateRoles: { en: string; zh: string; value: CorporateRole }[] = [
  { en: 'Founder', zh: '创始人', value: 'founder' },
  { en: 'Board Member', zh: '董事会成员', value: 'board_member' },
  { en: 'C-Suite Executive', zh: '首席执行官', value: 'c_suite' },
  { en: 'President', zh: '总裁', value: 'president' },
  { en: 'Managing Director', zh: '董事总经理', value: 'managing_director' },
  { en: 'Partner', zh: '合伙人', value: 'partner' },
  { en: 'Vice President', zh: '副总裁', value: 'vice_president' },
  { en: 'Director', zh: '总监', value: 'director' },
  { en: 'Senior Manager', zh: '高级经理', value: 'senior_manager' }
];

export default function IdentitySelection({
  selectedIdentity,
  selectedRole,
  onIdentitySelect,
  onRoleSelect,
  onContinue
}: IdentitySelectionProps): React.ReactElement {
  const { t, language } = useLanguage();

  const isIdentitySelected = (identity: IdentityType): boolean => {
    if (selectedIdentity === 'both') {
      return identity === 'mother' || identity === 'corporate';
    }
    return selectedIdentity === identity;
  };

  const showRoleSelection = isIdentitySelected('corporate') || selectedIdentity === 'both';

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
      
      {showRoleSelection && (
        <div className="role-selection">
          <h2 className="role-selection-title">
            {language === 'en' ? 'Select your role:' : '选择您的职位：'}
          </h2>
          <div className="role-options">
            {corporateRoles.map((role) => (
              <div
                key={role.value}
                className={`role-option ${selectedRole === role.value ? 'selected' : ''}`}
                onClick={() => onRoleSelect(selectedRole === role.value ? null : role.value)}
              >
                <span>{language === 'en' ? role.en : role.zh}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div 
        className={`option-container ${isIdentitySelected('other') ? 'selected' : ''}`}
        onClick={() => {
          onIdentitySelect('other');
          onRoleSelect(null); // Clear role selection when selecting 'other'
        }}
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
        disabled={!selectedIdentity || (showRoleSelection && !selectedRole)}
        lang={language}
      >
        {language === 'en' ? 'CONTINUE →' : '继续 →'}
      </button>
    </div>
  );
}