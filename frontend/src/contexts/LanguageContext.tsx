import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import translations, { TranslationsType } from '../i18n/translations.ts';

type LanguageContextType = {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  t: TranslationsType['en'] | TranslationsType['zh'];
};

const defaultValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: translations.en
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const getInitialLanguage = (): 'en' | 'zh' => {
    return 'en';
  };

  const [language, setLanguageState] = useState<'en' | 'zh'>(getInitialLanguage);
  
  const t = translations[language];
  
  const setLanguage = (lang: 'en' | 'zh') => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };
  
  useEffect(() => {
    localStorage.setItem('language', 'en');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 