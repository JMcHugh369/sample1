import './App.css';
import { Routes, Route } from 'react-router-dom';
// Needed to import the components JSX to JSX
import { useState, useEffect } from 'react';
import Nav from "./components/Nav";
import Home from "./components/Home";
import GameView from "./components/GameView";
import DMView from "./components/DMView";
import PlayerView from "./components/PlayerView";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserSettings from "./components/UserSettings";
import Welcome from "./components/Welcome";
import mapplaceholder from "./components/asset/mapplaceholder.png";

function App() {
  
  // Adding monster state that was previously in the GameView component
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    console.log("Monsters state in App.js:", monsters);
  }, [monsters]);

  // npc state that was previosuly in the GameView component
  const [npcs, setNpcs] = useState([]); 

  useEffect(() => {
    console.log("NPCs state in App.js:", npcs);
  }, [npcs]);

  const [maps, setMaps] = useState([
    { id: "1", name: "Default Map", src: mapplaceholder}
    
  ]);
  // Default to first map which should be mapplceholder.png
  const [selectedMap, setSelectedMap] = useState(maps[0]);

  useEffect(() => {
    console.log("Maps state in App.js", maps);
  }, [maps]);

  useEffect(() => {
    if (maps.length > 0) {
      setSelectedMap(maps[0]);
    }
  }, [maps]);

  useEffect(() => {
    console.log("Selected Map in App.js:", selectedMap);
}, [selectedMap]);

  // Update Routes to pass state down to GameView and DMView components
  return (
    <Routes>
      <Route path="/home" element={ <Home /> }
      />
      
      <Route
        path="/gameview"
        element={<GameView 
                            key={maps.length} // Force re-render when maps change
                            monsters={monsters}
                            setMonsters={setMonsters}
                            npcs={npcs}
                            setNpcs={setNpcs} 
                            maps={maps}
                            setMaps={setMaps}
                            selectedMap={selectedMap}
                            setSelectedMap={setSelectedMap}/>}
      />
      <Route path="/dmview" element={<DMView 
                            monsters={monsters}
                            setMonsters={setMonsters}
                            npcs={npcs}
                            setNpcs={setNpcs} 
                            maps={maps}
                            setMaps={setMaps}
                            selectedMap={selectedMap}
                            setSelectedMap={setSelectedMap}
                            />}
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
