import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import './App.css';

function App() {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <div>
            <h1>React Application</h1>
            <button onClick={fetchData}>Fetch Data</button>
            <pre id="output"></pre>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
