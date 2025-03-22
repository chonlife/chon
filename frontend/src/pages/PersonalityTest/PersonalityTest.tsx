import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './PersonalityTest.css';

const PersonalityTest = () => {
  const { t } = useLanguage();
  
  return (
    <main className="personality-test-container">
      <h1>{t.personalityTest.title}</h1>
      <p>{t.personalityTest.description}</p>
      
      <div className="test-content">
        <p>{t.personalityTest.content}</p>
      </div>
    </main>
  );
};

export default PersonalityTest; 