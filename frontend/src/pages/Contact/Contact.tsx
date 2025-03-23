import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Contact.css';

const Contact = () => {
  const { t, language } = useLanguage();
  
  const renderHtml = (html: string) => {
    const wrappedHtml = `<span lang="${language}">${html}</span>`;
    return <span dangerouslySetInnerHTML={{ __html: wrappedHtml }} />;
  };

  return (
    <main className="contact-container" lang={language}>
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      <div className="contact-content">
        <p className="main-text" lang={language}>
          {t.contact.prototype.text}
        </p>
        
        <p className="main-text" lang={language}>
          {t.contact.expertise.text}
        </p>
        
        <p className="main-text" lang={language}>
          {t.contact.skills.text}
        </p>
      </div>

      <div className="buttons-container">
        <button className="contact-button" lang={language}>{t.contact.buttons.fund}</button>
        <button className="contact-button" lang={language}>{t.contact.buttons.join}</button>
        <button className="contact-button" lang={language}>{t.contact.buttons.collaborate}</button>
      </div>
    </main>
  );
};

export default Contact; 