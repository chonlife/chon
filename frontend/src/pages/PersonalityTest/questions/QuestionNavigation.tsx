import React from 'react';

interface QuestionNavigationProps {
  showBack?: boolean;
  showNext?: boolean;
  showFinish?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  nextDisabled?: boolean;
  finishDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  showBack = false,
  showNext = false,
  showFinish = false,
  onBack,
  onNext,
  onFinish,
  nextDisabled = false,
  finishDisabled = false,
  backLabel = 'Back',
  nextLabel = 'Continue',
  finishLabel = 'Finish',
}) => (
  <div className="question-navigation">
    {showBack && (
      <button className="nav-button prev-button" onClick={onBack} type="button">
        {backLabel}
      </button>
    )}
    {showNext && (
      <button className="nav-button next-button" onClick={onNext} type="button" disabled={nextDisabled}>
        {nextLabel}
      </button>
    )}
    {showFinish && (
      <button className="nav-button finish-button" onClick={onFinish} type="button" disabled={finishDisabled}>
        {finishLabel}
      </button>
    )}
  </div>
);

export default QuestionNavigation; 