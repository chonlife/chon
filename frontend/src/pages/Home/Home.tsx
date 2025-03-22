import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Home.css';

const Home = () => {
  const { t, language } = useLanguage();

  const renderHtml = (html: string) => {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const debugLanguage = () => {
    console.log('Current language in Home:', language);
    console.log('Current translations in Home:', t);
  };

  React.useEffect(() => {
    debugLanguage();
  }, [language, t]);

  return (
    <main className="main-content">
      {/* Background Elements */}
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      {/* Logo */}
      <div className="logo-container">
        <h1 className="logo">
          CH<span className="highlight-letter">O</span>N
        </h1>
      </div>

      {/* Content Sections */}
      <section className="content-section">
        <p className="mission-statement">
          {renderHtml(t.home.motherhood.paragraph)}
        </p>
      </section>

      <section className="content-section">
        <p className="dont-empower-text">{t.home.empowerment.dontEmpower}</p>
        <p>{renderHtml(t.home.empowerment.paragraph)}</p>
      </section>

      <section className="content-section">
        <p>
          {renderHtml(t.home.about.weAre)}, {renderHtml(t.home.about.paragraph)}
        </p>
      </section>

      {/* Call to Action Button */}
      <div className="cta-container">
        <button 
          className="cta-button" 
          onClick={debugLanguage}
        >
          {t.home.cta}
        </button>
      </div>
    </main>
  );
};

export default Home; 