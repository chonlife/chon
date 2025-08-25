import React from 'react';
import { TestStep } from '../PersonalityTest';

interface TopActionsProps {
  step: TestStep;
  language: string;
  onRestart: (e?: React.MouseEvent) => void;
  onSaveAndExit: () => void;
}

const TopActions: React.FC<TopActionsProps> = ({ 
  step, 
  language, 
  onRestart, 
  onSaveAndExit 
}) => {
  return (
    <div className="exit-actions">
      {/* Restart button (was Exit) */}
      <button 
        type="button" 
        className="exit-button restart-button show-tooltip" 
        lang={language} 
        onClick={onRestart}
      >
        <img 
          src={new URL('../../../icons/Restart.svg', import.meta.url).toString()} 
          alt="Restart" 
          style={{ width: 18, height: 18 }} 
        />
        <span className="exit-button-text" style={{ marginLeft: 6 }}>
          {language === 'en' ? 'Restart' : '重新开始'}
        </span>
        <div className="exit-button-tooltip">
          {language === 'en' ? 'Restart' : '重新开始'}
        </div>
      </button>
      
      {/* Save & Exit only on questionnaire pages */}
      {step === 'questionnaire' && (
        <button 
          type="button" 
          className="exit-button save-exit-button show-tooltip" 
          lang={language} 
          onClick={onSaveAndExit}
        >
          <img 
            src={new URL('../../../icons/Save.svg', import.meta.url).toString()} 
            alt="Save & Exit" 
            style={{ width: 18, height: 18 }} 
          />
          <span className="exit-button-text" style={{ marginLeft: 6 }}>
            {language === 'en' ? 'Save & Exit' : '保存并退出'}
          </span>
          <div className="exit-button-tooltip">
            {language === 'en' ? 'Save & Exit' : '保存并退出'}
          </div>
        </button>
      )}
    </div>
  );
};

export default TopActions;
