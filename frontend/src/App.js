import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Fixed import statement
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import CreateCharacter from './CreateCharacter';
import CreateAccount from './CreateAccount';
import CreateCampaign from './CreateCampaign';
import JoinCampaign from './JoinCampaign';
import ViewCharacters from './ViewCharacters';
import NotFound from './NotFound'; // Imported NotFound component
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Set Login as the default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-character" element={<CreateCharacter />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/join-campaign" element={<JoinCampaign />} />
        <Route path="/view-characters" element={<ViewCharacters />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
