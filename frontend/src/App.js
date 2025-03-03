import React from 'react';
import logo from './logo.svg';
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
    <div>
      <h1>React Application</h1>
      <button onClick={fetchData}>Fetch Data</button>
      <pre id="output"></pre>
    </div>
  );
}

export default App;
