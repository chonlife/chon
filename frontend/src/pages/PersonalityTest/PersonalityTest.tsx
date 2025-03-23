import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './PersonalityTest.css';

const PersonalityTest = () => {
  const { t, language } = useLanguage();
  
  return (
    <main className="personality-test-container" lang={language}>
      <h1 lang={language}>{t.personalityTest.title}</h1>
      <p lang={language}>{t.personalityTest.description}</p>
      
      <div className="test-content" lang={language}>
        <p lang={language}>{t.personalityTest.content}</p>
      </div>
    </main>
  );
};

export default PersonalityTest; 