import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [discord, setDiscord] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting account creation request:', { username, email, password, discord });
    try {
      const response = await fetch('http://localhost:5001/add_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, discord }),
      });
      console.log('Account creation response status:', response.status);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response');
      }
      const data = await response.json();
      console.log('Account creation response data:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      if (data.success) {
        navigate('/login'); // Redirect to login page
      } else {
        setError(data.message || 'Account creation failed');
      }
    } catch (err) {
      console.error('Error during account creation request:', err);
      setError(err.message || 'Failed to fetch');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Discord:</label>
        <input
          type="text"
          value={discord}
          onChange={(e) => setDiscord(e.target.value)}
        />
      </div>
      <button type="submit">Create Account</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default CreateAccount;
