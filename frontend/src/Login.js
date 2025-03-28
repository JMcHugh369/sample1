import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login request:', { username, password });
    try {
      const response = await fetch('http://localhost:3000/authenticate_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      if (data.success) {
        navigate('/home'); // Redirect to home page
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login request:', err);
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
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
      <button type="button" onClick={() => navigate('/create-account')}>Create Account</button>
    </form>
  );
};

export default Login;