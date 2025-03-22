import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = (lang: 'en' | 'zh') => {
    console.log('Language selected:', lang);
    setLanguage(lang);
  };

  const handleEnglishClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLanguage('en');
  };

  const handleChineseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLanguage('zh');
  };

  return (
    <div className="language-selector">
      <button 
        className={`lang-button ${language === 'en' ? 'active' : ''}`}
        onClick={handleEnglishClick}
        type="button"
      >
        English
      </button>
      <span className="lang-separator">/</span>
      <button 
        className={`lang-button ${language === 'zh' ? 'active' : ''}`}
        onClick={handleChineseClick}
        type="button"
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSelector; 