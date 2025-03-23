import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Home.css';

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const renderHtml = (html: string) => {
    const wrappedHtml = `<span lang="${language}">${html}</span>`;
    return <span dangerouslySetInnerHTML={{ __html: wrappedHtml }} />;
  };

  const debugLanguage = () => {
    console.log('Current language in Home:', language);
    console.log('Current translations in Home:', t);
  };

  React.useEffect(() => {
    debugLanguage();
  }, [language, t]);

  const handleCtaClick = () => {
    navigate('/personality-test');
  };

  return (
    <main className="main-content" lang={language}>
      {/* Background Elements */}
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      {/* Logo */}
      <div className="logo-container">
        <h1 className="logo" lang="en">
          CH<span className="highlight-letter">O</span>N
        </h1>
      </div>

      {/* Content Sections */}
      <section className="content-section" lang={language}>
        <p className="mission-statement" lang={language}>
          {renderHtml(t.home.motherhood.paragraph)}
        </p>
      </section>

      <section className="content-section" lang={language}>
        <p className="dont-empower-text" lang={language}>{t.home.empowerment.dontEmpower}</p>
        <p lang={language}>{renderHtml(t.home.empowerment.paragraph)}</p>
      </section>

      <section className="content-section close-section" lang={language}>
        <p lang={language}>
          {renderHtml(t.home.about.weAre)}, {renderHtml(t.home.about.paragraph)}
        </p>
      </section>

      {/* Call to Action Button */}
      <div className="cta-container">
        <button 
          className="cta-button" 
          onClick={handleCtaClick}
          lang={language}
        >
          {t.home.cta}
        </button>
      </div>
    </main>
  );
};

export default Home; 