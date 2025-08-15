import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

const Profile: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const username = user?.username || 'User';
  const [isResultsReady, setIsResultsReady] = useState<boolean>(false);

  const checkResultsPresence = () => {
    try {
      const answersRaw = localStorage.getItem('chon_personality_answers');
      const tagStatsRaw = localStorage.getItem('tagStats');
      if (tagStatsRaw) return true;
      if (answersRaw) {
        const answers = JSON.parse(answersRaw || '{}');
        return answers && Object.keys(answers).length > 0;
      }
      return false;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    setIsResultsReady(checkResultsPresence());
    if (!checkResultsPresence()) {
      const intervalId = setInterval(() => {
        if (checkResultsPresence()) {
          setIsResultsReady(true);
          clearInterval(intervalId);
        }
      }, 300);
      return () => clearInterval(intervalId);
    }
  }, []);

  const handleGoToResults = () => {
    if (!isResultsReady) return;
    navigate('/personality-test');
  };
  return (
    <main className="personality-test-container">
      <div style={{ maxWidth: 560, margin: '0 auto', color: '#fff' }}>
        <h1 style={{ textAlign: 'center' }}>{username}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 12 }}>
          <button
            className="primary-button"
            onClick={handleGoToResults}
            disabled={!isResultsReady}
            aria-busy={!isResultsReady}
          >
            {isResultsReady ? 'See my personality test results' : 'Loading results...'}
          </button>
          <button className="secondary-button" onClick={() => { logout(); navigate('/login', { replace: true }); }}>Log out</button>
        </div>
      </div>
    </main>
  );
};

export default Profile;


