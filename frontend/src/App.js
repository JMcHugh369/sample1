import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from "./components/Nav";
import Welcome from "./components/Welcome/index.js"; // Import Welcome component
import Home from "./components/Home/index.js";
import GameView from "./components/GameView/index.js";
import DMView from "./components/DMView/index.js";
import PlayerView from "./components/PlayerView/index.js";
import Login from "./components/Login/index.js";
import SignUp from "./components/SignUp/index.js";
import UserSettings from "./components/UserSettings/index.js";
import CreateCharacter from "./components/CreateCharacter/index.js"; // Import CreateCharacter component
import CharacterDetails from "./components/CharacterDetails/index.js";
import SelectCharacter from "./components/SelectCharacter"; // Import SelectCharacter component
 // Import the CharacterDetails component
// import About from './components/About/index.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} /> {/* Set Welcome as the default page */}
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/character/:characterId" element={<CharacterDetails />} /> {/* Add this route */}
        <Route path="/gameview" element={<GameView />} />
        <Route path="/dm/:campaignId" element={<DMView />} />
        <Route path="/playerview/:campaignId/:characterId" element={<PlayerView />} /> {/* Add this route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/usersettings" element={<UserSettings />} />
        <Route path="/create-character" element={<CreateCharacter />} /> {/* Add CreateCharacter route */}
        <Route path="/selectcharacter/:campaignId" element={<SelectCharacter />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
