import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="question-progress-container">
    <div className="question-progress-bar">
      <div
        className="question-progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default ProgressBar; 