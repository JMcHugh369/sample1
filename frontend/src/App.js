import './App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from "./components/Nav";
import Home from "./components/Home";
import GameView from "./components/GameView";
import DMView from "./components/DMView";
import PlayerView from "./components/PlayerView";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserSettings from "./components/UserSettings";
import Welcome from "./components/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/home" element={ <Home /> }
      />
      <Route path="/gameview" element={ <GameView /> }
      />
      <Route path="/dmview" element={ <DMView /> }
      />
      <Route path="/playerview" element={ <PlayerView /> }
      />
      <Route path="/login" element={ <Login /> }
      />
      <Route path="/signup" element={ <SignUp /> }
      />
      <Route path="/usersettings" element={ <UserSettings /> }
      />
      <Route path="/welcome" element={ <Welcome /> }
      />
    </Routes>
  );
}

export default App;
