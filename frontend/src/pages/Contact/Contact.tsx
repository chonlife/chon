import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Contact.css';

const Contact = () => {
  const { t, language } = useLanguage();
  
  return (
    <main className="contact-container" lang={language}>
      <h1 lang={language}>{t.contact.title}</h1>
      <p lang={language}>{t.contact.description}</p>
      
      <div className="contact-form" lang={language}>
        <div className="form-group">
          <label htmlFor="name" lang={language}>{t.contact.form.name}</label>
          <input type="text" id="name" name="name" />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" lang={language}>{t.contact.form.email}</label>
          <input type="email" id="email" name="email" />
        </div>
        
        <div className="form-group">
          <label htmlFor="message" lang={language}>{t.contact.form.message}</label>
          <textarea id="message" name="message" rows={5}></textarea>
        </div>
        
        <button type="submit" className="submit-button" lang={language}>{t.contact.form.send}</button>
      </div>
    </main>
  );
};

export default Contact; 