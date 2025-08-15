import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const username = localStorage.getItem('chon_username') || 'User';
  return (
    <main className="personality-test-container">
      <div style={{ maxWidth: 560, margin: '0 auto', color: '#fff' }}>
        <h1 style={{ textAlign: 'center' }}>{username}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <Link className="primary-button" to="/personality-test">See my personality test results</Link>
        </div>
      </div>
    </main>
  );
};

export default Profile;


