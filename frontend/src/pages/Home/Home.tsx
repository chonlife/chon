import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Home.css';

const Home = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

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
      {language === 'zh' ? (
        <>
          <section className="content-section" lang={language}>
            <p className="mission-statement" lang={language}>
              我们的目标是认识并转变<strong>母亲这一身份</strong>为企业的一项<strong>资产</strong>，从而为<strong>所有碳基生命</strong>营造更人性化的企业环境。
            </p>
          </section>

          <section className="content-section" lang={language}>
            <p className="dont-empower-text" lang={language}>我们不赋能母亲。</p>
            <p lang={language}>我们赋能<strong>企业界</strong>，以科学和高效的策略拥抱母亲的力量，为所有有母亲的生命建立一个更有<strong>爱</strong>的世界。</p>
          </section>

          <section className="content-section close-section" lang={language}>
            <p lang={language}>我们是<strong>CHON</strong>，源于碳(C)、氢(H)、氧(O)、和氮(N)，占据人体<strong>95%</strong>的这四种元素。</p>
          </section>
        </>
      ) : (
        <>
          <section className="content-section" lang={language}>
            <p className="mission-statement" lang={language}>
              We aim to recognize and transform <strong>MOTHERHOOD</strong> as an <strong>ASSET</strong> for corporation to build a more humanitarian corporate environment for <strong>ALL CARBON-BASED LIVES</strong>.
            </p>
          </section>

          <section className="content-section" lang={language}>
            <p className="dont-empower-text" lang={language}>We don't empower mothers.</p>
            <p lang={language}>We empower the <strong>CORPORATE WORLD</strong> to embrace the presence of motherhood with scientific and effective strategies to build a world with more <strong>LOVE</strong> for all lives that have a mother.</p>
          </section>

          <section className="content-section close-section" lang={language}>
            <p lang={language}>We are <strong>CHON</strong>, derived from Carbon (C), Hydrogen (H), Oxygen (O), and Nitrogen (N), the four elements that make up <strong>95%</strong> of the human body.</p>
          </section>
        </>
      )}

      {/* Call to Action Button */}
      <div className="cta-container">
        <button 
          className="cta-button" 
          onClick={handleCtaClick}
          lang={language}
        >
          {language === 'zh' ? '我是碳基生命 →' : "I'M A CARBON-BASED LIFE →"}
        </button>
      </div>
    </main>
  );
};

export default Home; 