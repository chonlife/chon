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
  React.useEffect(() => {
    // Scroll to top when mounting Privacy page
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  // English version with rich text formatting
  const privacyTextEn = (
    <>
      <h1 className="privacy-title">Data Usage and Privacy Statement</h1>
      <p className="privacy-intro">
        At CHON, your privacy is fundamental. We only collect the information necessary to deliver meaningful insights, and we protect it with the highest standards of security and integrity.
      </p>
      <div className="privacy-section">
        <h2>For Individual Participants</h2>
        <p>Your personal information will be used solely for the following purposes:</p>
        <ul>
          <li>To verify your eligibility for specific sections of the survey</li>
          <li>To support demographic and statistical analysis across participant groups</li>
          <li>To generate your personalized CHON personality profile</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, share, or disclose your individual data under any circumstances. All responses are securely stored and accessible only to authorized research personnel.
        </p>
      </div>
    </>
  );

  // Chinese version with rich text formatting
  const privacyTextZh = (
    <>
      <h1 className="privacy-title">数据使用和隐私声明</h1>
      <p className="privacy-intro">
        在CHON，您的隐私至关重要。我们只收集必要的信息以提供有意义的见解，并以最高的安全和完整性标准保护这些信息。
      </p>
      <div className="privacy-section">
        <h2>对于个人参与者</h2>
        <p>您的个人信息将仅用于以下目的：</p>
        <ul>
          <li>验证您参与调查特定部分的资格</li>
          <li>支持参与者群体间的人口统计和统计分析</li>
          <li>生成您的个性化CHON性格档案</li>
        </ul>
        <p>
          我们<strong>绝不</strong>会在任何情况下出售、共享或披露您的个人数据。所有回复都被安全存储，只有授权的研究人员才能访问。
        </p>
      </div>
    </>
  );

  // Add class based on selectedIdentity
  const privacyClass = selectedIdentity === 'mother' ? 'mother-privacy' : 'other-privacy';

  return (
    <div className={`privacy-statement ${privacyClass}`} lang={language} style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <div className="privacy-text" lang={language}>
        {language === 'en' ? privacyTextEn : privacyTextZh}
      </div>
      <button 
        className="privacy-continue"
        onClick={onContinue}
        lang={language}
      >
        <span>{language === 'en' ? 'AGREE & CONTINUE' : '同意并继续'}</span>
        <span className="continue-arrow">→</span>
      </button>
    </div>
  );
};

export default PrivacyStatement; 