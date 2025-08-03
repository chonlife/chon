import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './PersonalityTest.css';

interface PrivacyStatementProps {
  selectedIdentity: string | null;
  onContinue: () => void;
}

const PrivacyStatement: React.FC<PrivacyStatementProps> = ({
  selectedIdentity,
  onContinue
}) => {
  const { language } = useLanguage();

  // Add line breaks to privacy text - English version
  const privacyTextEn = "Your information will only be used for verification purposes and to formulate your CHON personality test.\n\n" +
    "It will not be shared, disclosed, or used for any other purpose.\n\n" +
    "We are committed to protecting your privacy and ensuring the security of your data.";
  
  // Chinese version of privacy text - optimized Chinese paragraph structure
  const privacyTextZh = "您的信息将仅用于验证目的和制定您的 CHON 性格测试。\n\n" +
    "您的信息不会被共享、披露或用于任何其他目的。\n\n" +
    "我们重视您的隐私，并承诺保护您的数据安全。";
  
  // Add class based on selectedIdentity
  const privacyClass = selectedIdentity === 'mother' ? 'mother-privacy' : 'other-privacy';
  
  return (
    <div className={`privacy-statement ${privacyClass}`} lang={language} style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <p className="privacy-text" lang={language} style={{ whiteSpace: 'pre-line' }}>
        {language === 'en' 
          ? privacyTextEn
          : privacyTextZh
        }
      </p>
      <button 
        className="privacy-continue"
        onClick={onContinue}
        lang={language}
      >
        <span>{language === 'en' ? 'CONTINUE' : '继续'}</span>
        <span className="continue-arrow">→</span>
      </button>
    </div>
  );
};

export default PrivacyStatement; 