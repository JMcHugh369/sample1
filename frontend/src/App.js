import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home'; // Import the Home component
import CreateAccount from './CreateAccount'; // Import the CreateAccount component
import './App.css';

function App() {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log(data);
      document.getElementById('output').textContent = JSON.stringify(data, null, 2); // Update the DOM with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} /> {/* Add route for the account creation page */}
        <Route path="/" element={
          <div>
            <h1>React Application</h1>
            <button onClick={fetchData}>Fetch Data</button>
            <pre id="output"></pre>
          </div>
        } />
        <Route path="/home" element={<Home />} /> {/* Add route for the homepage */}
      </Routes>
    </Router>
  );
}

export default App;
