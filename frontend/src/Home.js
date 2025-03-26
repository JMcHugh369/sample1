import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCampaign from './CreateCampaign';

const Home = () => {
  const [username, setUsername] = useState('');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'Guest';
    console.log('Loaded username from localStorage:', storedUsername);
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    console.log('Logging out user');
    localStorage.removeItem('username'); // Clear the username from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>What would you like to do today?</p>
      <button onClick={() => navigate('/create-character')}>Create a New Character</button>
      <button onClick={() => setShowCreateCampaign(true)}>Create a New Campaign</button>
      <button onClick={() => navigate('/join-campaign')}>Join a Campaign</button>
      <button onClick={() => navigate('/view-characters')}>View Your Characters</button> {/* New button */}
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}

      {showCreateCampaign && (
        <CreateCampaign onClose={() => setShowCreateCampaign(false)} />
      )}
    </div>
  );
};

export default Home;
