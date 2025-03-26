import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinCampaign = () => {
  const [campaignName, setCampaignName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinCampaign = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    console.log('Joining campaign with data:', { campaignName, accessCode, username });

    if (!username) {
      alert('Username is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/join_campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignName, accessCode, username }),
      });

      const data = await response.json();
      console.log('Join campaign response:', data);

      if (response.ok) {
        alert('Successfully joined the campaign!');
        console.log('Campaign joined successfully, reloading the page');
        window.location.reload(); // Reload the page after successful submission
      } else {
        console.error('Failed to join campaign:', data);
        setError(data.message || 'Failed to join campaign');
      }
    } catch (err) {
      console.error('Error joining campaign:', err);
      setError(err.message || 'An error occurred while joining the campaign.');
    }
  };

  const handleBack = () => {
    console.log('Navigating back to the previous page');
    navigate(-1);
  };

  return (
    <form onSubmit={handleJoinCampaign}>
      <h1>Join Campaign</h1>
      <div>
        <label>Campaign Name:</label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => {
            console.log('Campaign name updated:', e.target.value);
            setCampaignName(e.target.value);
          }}
          required
        />
      </div>
      <div>
        <label>Access Code:</label>
        <input
          type="text"
          value={accessCode}
          onChange={(e) => {
            console.log('Access code updated:', e.target.value);
            setAccessCode(e.target.value);
          }}
          required
        />
      </div>
      <button type="submit">Join Campaign</button>
      <button type="button" onClick={handleBack}>
        Back
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default JoinCampaign;
