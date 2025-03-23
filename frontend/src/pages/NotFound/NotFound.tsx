import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="molecule-background"></div>
      <div className="hexagon-pattern"></div>
      
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          The page you're looking for doesn't exist.
        </p>
        <div className="not-found-actions">
          <button 
            className="home-button" 
            onClick={handleGoHome}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 