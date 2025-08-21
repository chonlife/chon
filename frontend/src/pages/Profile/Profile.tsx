import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { cardsData, findBestMatch, mapTagStatsToScores, CardData } from '../../utils/archetypes';
import { getOrComputeTagStats } from '../../utils/scoring';

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
  const [bestMatch, setBestMatch] = useState<CardData | null>(null);

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

  // Compute best match from tagStats when available; compute tagStats on demand if missing
  useEffect(() => {
    const tryCompute = () => {
      try {
        const stats = getOrComputeTagStats();
        if (!stats) return false;
        const userScores = mapTagStatsToScores(stats);
        if (!userScores || Object.keys(userScores).length === 0) return false;
        const result = findBestMatch(userScores, cardsData);
        setBestMatch(result.bestMatch);
        return true;
      } catch (_) {
        return false;
      }
    };
    if (!tryCompute()) {
      const id = setInterval(() => {
        if (tryCompute()) {
          clearInterval(id);
        }
      }, 300);
      return () => clearInterval(id);
    }
  }, []);

  const handleGoToResults = () => {
    if (!isResultsReady) return;
    navigate('/personality-test');
  };
  return (
    <main className="personality-test-container">
      <div style={{ maxWidth: 560, margin: '0 auto', color: '#fff' }}>
        <h1 style={{ textAlign: 'center' }}>Welcome, {username}</h1>
        {bestMatch && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, marginBottom: 48 }}>
            <img
              src={bestMatch.image}
              alt={bestMatch.name.en}
              style={{ width: 250, height: 350, borderRadius: 16, objectFit: 'cover', boxShadow: '0 10px 28px rgba(0,0,0,0.35)' }}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 12 }}>
          <button
            className="primary-button"
            onClick={handleGoToResults}
            disabled={!isResultsReady}
            aria-busy={!isResultsReady}
          >
            {isResultsReady ? 'View results' : 'Loading results...'}
          </button>
          <button className="secondary-button" onClick={() => { logout(); navigate('/login', { replace: true }); }}>Log out</button>
        </div>
      </div>
    </main>
  );
};

export default Profile;


