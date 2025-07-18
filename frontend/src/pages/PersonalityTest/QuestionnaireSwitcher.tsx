import React from 'react';

interface QuestionnaireSwitcherProps {
  isPrimaryActive: boolean;
  onSwitch: (toPrimary: boolean) => void;
  primaryLabel: string;
  secondaryLabel: string;
}

const QuestionnaireSwitcher: React.FC<QuestionnaireSwitcherProps> = ({
  isPrimaryActive,
  onSwitch,
  primaryLabel,
  secondaryLabel,
}) => (
  <div className="questionnaire-switcher">
    <button
      className={`switcher-button ${isPrimaryActive ? 'active' : ''}`}
      onClick={() => { if (!isPrimaryActive) onSwitch(true); }}
      type="button"
    >
      {primaryLabel}
    </button>
    <button
      className={`switcher-button ${!isPrimaryActive ? 'active' : ''}`}
      onClick={() => { if (isPrimaryActive) onSwitch(false); }}
      type="button"
    >
      {secondaryLabel}
    </button>
  </div>
);

export default QuestionnaireSwitcher; 