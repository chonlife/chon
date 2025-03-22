import { useLanguage } from '../../contexts/LanguageContext.tsx';
import './Contact.css';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <main className="contact-container">
      <h1>{t.contact.title}</h1>
      <p>{t.contact.description}</p>
      
      <div className="contact-form">
        <div className="form-group">
          <label htmlFor="name">{t.contact.form.name}</label>
          <input type="text" id="name" name="name" />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">{t.contact.form.email}</label>
          <input type="email" id="email" name="email" />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">{t.contact.form.message}</label>
          <textarea id="message" name="message" rows={5}></textarea>
        </div>
        
        <button type="submit" className="submit-button">{t.contact.form.send}</button>
      </div>
    </main>
  );
};

export default Contact; 