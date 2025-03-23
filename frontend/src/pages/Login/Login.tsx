import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Login.css';

const Login = () => {
  const { t } = useLanguage();
  
  return (
    <div className="login-container">
      <h1>{t.login.title}</h1>
      <div className="login-content">
        <p>{t.login.comingSoon}</p>
      </div>
    </div>
  );
};

export default Login; 