import React, { useRef, useEffect, useState } from 'react';
import { useStateContext } from './StateContext'; // Removed useNavigate import

const CreateCampaign = ({ onClose }) => {
  const nameRef = useRef(null); // Initialize ref for the input field
  const [error, setError] = useState('');
  const { campaigns, setCampaigns } = useStateContext();

  useEffect(() => {
    console.log('CreateCampaign component mounted');
    if (nameRef.current) {
      nameRef.current.focus(); // Programmatically focus the input field
    } else {
      console.error('nameRef is not attached to the input field');
    }
    return () => {
      console.log('CreateCampaign component unmounted');
    };
  }, []); // Run only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const name = nameRef.current.value;
    const dm_username = localStorage.getItem('username');
    console.log('Submitting campaign creation request:', { name, dm_username }); // Log the payload

    if (!dm_username) {
      alert('DM username is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/add_campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dm_username }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Campaign created successfully!');
        console.log('Campaign creation successful:', data.campaign);
        setCampaigns([...campaigns, data.campaign]); // Update state instead of reloading
        onClose(); // Close the modal
      } else {
        const data = await response.json();
        console.error('Campaign creation failed:', data);
        setError(data.message || 'Failed to create campaign');
      }
    } catch (err) {
      console.error('Error during campaign creation:', err);
      setError(err.message || 'An error occurred while creating the campaign.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <h1>Create Campaign</h1>
          <div>
            <label>Campaign Name:</label>
            <input
              type="text"
              ref={nameRef} // Attach the ref to the input field
              onChange={(e) => console.log('Campaign name updated:', e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Campaign</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;



