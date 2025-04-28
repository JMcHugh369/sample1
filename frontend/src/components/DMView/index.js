import "./index.scss";
import GameView from "../GameView";
import { useState, useEffect, useRef } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import map from "../asset/gameside/minimap.png";
import adventurer from "../asset/dmside/adventurer.png";
import addmonster from "../asset/dmside/add-monster.png";
import addnpc from "../asset/dmside/add-npc.png";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:5002"); // Use your server URL

const DMView = () => {
    // Get campaignId from URL or state
    const { campaignId } = useParams();
    const [resolvedCampaignId, setResolvedCampaignId] = useState(campaignId || null);

    // State for DM user info and campaign
    const [currentUser, setCurrentUser] = useState(null);

    // Example: Fetch DM info and campaign if needed
    useEffect(() => {
        if (!resolvedCampaignId) return; // Don't fetch if campaignId is null
        const campaignIdInt = parseInt(resolvedCampaignId, 10);
        if (isNaN(campaignIdInt)) return; // Extra guard

        async function fetchDMInfo() {
            const res = await fetch(`http://localhost:5002/dm/me?campaignId=${campaignIdInt}`);
            if (res.ok) {
                const data = await res.json();
                setCurrentUser({ id: data.id, username: data.username, isDM: true });
                if (!resolvedCampaignId && data.campaign_id) {
                    setResolvedCampaignId(data.campaign_id);
                }
            }
        }
        if (!currentUser) fetchDMInfo();
    }, [currentUser, resolvedCampaignId]);

    useEffect(() => {
        if (!resolvedCampaignId) return;
        fetch(`http://localhost:5002/campaigns/${resolvedCampaignId}/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || []);
                console.log("DMView fetched users:", data.users);
            })
            .catch(err => {
                console.error("DMView error fetching users:", err);
            });
    }, [resolvedCampaignId]);

    // State management
    const [monsters, setMonsters] = useState([]);
    const [tokenInfoVisible, setTokenInfoVisible] = useState(false);
    const [dndMonsters, setDndMonsters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMonsters, setFilteredMonsters] = useState([]);
    const [selectedMonster, setSelectedMonster] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [maps, setMaps] = useState([]); // To store map images
    const [mapInfoVisible, setMapInfoVisible] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);
    const [users, setUsers] = useState([]);

    // Refs
    const searchRef = useRef(null);
    const fileInputRef = useRef(null);

    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch all monsters from D&D API on component mount
    useEffect(() => {
        const fetchMonsters = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://www.dnd5eapi.co/api/monsters');
                if (!response.ok) {
                    throw new Error('Failed to fetch monsters list');
                }
                const data = await response.json();
                setDndMonsters(data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMonsters();
    }, []);

    // Filter monsters based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredMonsters([]);
            return;
        }

        const filtered = dndMonsters.filter(monster =>
            monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            monster.index.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredMonsters(filtered);
    }, [searchTerm, dndMonsters]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch detailed monster data
    const fetchMonsterDetails = async (index) => {
        try {
            setLoading(true);
            const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
            if (!response.ok) {
                throw new Error('Failed to fetch monster details');
            }
            const data = await response.json();
            setSelectedMonster(data);

            // Add monster to the list with the data from the API
            addMonsterFromDnd(data);

            setLoading(false);
            setShowDropdown(false);
            setSearchTerm('');
            hideTokenInfo();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Calculate ability modifier
    const getAbilityModifier = (score) => {
        const modifier = Math.floor((score - 10) / 2);
        return modifier >= 0 ? `+${modifier}` : modifier;
    };

    function minMonster() {
        const viewMon = document.getElementById('view-monster');
        if (viewMon) {
            viewMon.className = "invisible";
        }
    }

    function upMonster() {
        const viewMon = document.getElementById('view-monster');
        if (viewMon) {
            viewMon.className = "visible";
        }
    }

    function showTokenInfo() {
        setTokenInfoVisible(true);
    }

    function hideTokenInfo() {
        setTokenInfoVisible(false);
    }

    function viewPC() {
        // Your existing function
    }

    // Function to handle file selection for maps
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const mapData = {
                    src: e.target.result, // base64 image
                    name: file.name
                };
                setMaps([mapData]);
                // Save to backend
                await fetch(`http://localhost:5002/campaigns/${resolvedCampaignId}/map`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(mapData)
                });
                // Emit to all clients
                socket.emit("map_update", {
                    campaignId: resolvedCampaignId,
                    map: mapData
                });
            };
            reader.readAsDataURL(file);
        }
    }

    // Listen for map updates from other clients (including DM)
    useEffect(() => {
        function handleMapUpdate({ campaignId: incomingCampaignId, map }) {
            if (String(incomingCampaignId) === String(resolvedCampaignId)) {
                setMaps([map]);
            }
        }
        socket.on("map_update", handleMapUpdate);
        return () => socket.off("map_update", handleMapUpdate);
    }, [resolvedCampaignId]);

    // Function to trigger file input click
    function addMap() {
        fileInputRef.current.click();
    }

    // Functions for map info popup
    function viewMapInfo(map) {
        setSelectedMap(map);
        setMapInfoVisible(true);
    }

    function closeMapInfo() {
        setMapInfoVisible(false);
    }

    function addNPC() {
        // Your existing function
    }

    function addMonster() {
        var popup = document.getElementById("add-monster");
        if (popup) {
            popup.classList.toggle("show");
        }

        const monster = {
            name: "New Monster",
            size: "size",
            alignment: "alignment",
            ac: "ac",
            hp: "hp",
            spd: "spd",
            str: "str",
            dex: "dex",
            con: "con",
            int: "int",
            wis: "wis",
            cha: "cha"
        };

        setMonsters([...monsters, monster]);
    }

    // Add a monster from the D&D API data
    function addMonsterFromDnd(monsterData) {
        // Create a monster object from the API data
        const monster = {
            id: monsterData.index,
            name: monsterData.name,
            size: monsterData.size,
            alignment: monsterData.alignment,
            ac: monsterData.armor_class[0].value,
            hp: monsterData.hit_points,
            spd: Object.entries(monsterData.speed)
                .map(([type, value]) => `${type} ${value}`)
                .join(', '),
            str: monsterData.strength,
            dex: monsterData.dexterity,
            con: monsterData.constitution,
            int: monsterData.intelligence,
            wis: monsterData.wisdom,
            cha: monsterData.charisma,
            // Add additional properties
            challengeRating: monsterData.challenge_rating,
            xp: monsterData.xp,
            type: monsterData.type,
            // Include full monster data for reference
            fullData: monsterData
        };

        // Add to monsters state
        setMonsters(prevMonsters => [...prevMonsters, monster]);

        // Show the monster view panel with the monster data
        setSelectedMonster(monsterData);
        upMonster();
    }

    // View a specific monster's details
    function viewMonsterDetails(monster) {
        if (monster.fullData) {
            setSelectedMonster(monster.fullData);
        } else {
            setSelectedMonster({
                name: monster.name,
                size: monster.size,
                alignment: monster.alignment,
                armor_class: [{ value: monster.ac }],
                hit_points: monster.hp,
                speed: { walk: monster.spd },
                strength: monster.str,
                dexterity: monster.dex,
                constitution: monster.con,
                intelligence: monster.int,
                wisdom: monster.wis,
                charisma: monster.cha
            });
        }
        upMonster();
    }

    // Update monster stats
    function updateMonsterStat(statName, value) {
        console.log(`Updating ${statName} to ${value}`); // Helpful for debugging
        
        // Update the selected monster
        setSelectedMonster(prevMonster => {
          const updatedMonster = { ...prevMonster };
          
          // Handle different stat properties appropriately
          if (statName === 'ac') {
            updatedMonster.armor_class = [{ value }];
          } else if (statName === 'hp') {
            updatedMonster.hit_points = value;
          } else if (statName === 'spd') {
            // For simplicity, we'll just update the 'walk' speed
            if (typeof updatedMonster.speed === 'object') {
              updatedMonster.speed = { 
                ...updatedMonster.speed, // Preserve other speed types
                walk: value 
              };
            } else {
              updatedMonster.speed = value;
            }
          }
          
          return updatedMonster;
        });
      
        // Update the monster in the monsters array to persist changes
        setMonsters(prevMonsters => {
          return prevMonsters.map(m => {
            // Check if this is the monster we want to update
            if (m.id === selectedMonster.index || 
                (m.fullData && m.fullData.index === selectedMonster.index)) {
              
              const updatedMonster = { ...m };
              
              // Update the direct property
              if (statName === 'ac') {
                updatedMonster.ac = value;
              } else if (statName === 'hp') {
                updatedMonster.hp = value;
              } else if (statName === 'spd') {
                updatedMonster.spd = value;
              }
              
              // IMPORTANT: Also update the nested fullData if it exists
              if (updatedMonster.fullData) {
                const updatedFullData = { ...updatedMonster.fullData };
                
                if (statName === 'ac' && updatedFullData.armor_class) {
                  // Create a new array with the updated value
                  updatedFullData.armor_class = [{ value }];
                } else if (statName === 'hp') {
                  updatedFullData.hit_points = value;
                } else if (statName === 'spd' && updatedFullData.speed) {
                  // Keep existing speeds but update 'walk'
                  updatedFullData.speed = { 
                    ...updatedFullData.speed,
                    walk: value 
                  };
                }
                
                updatedMonster.fullData = updatedFullData;
              }
              
              return updatedMonster;
            }
            
            return m;
          });
        });
      }

    // Delete a monster
    function deleteMonster(id) {
        setMonsters(monsters.filter((monster, index) => index !== id));
    }

    return (
        <>
            <GameView campaignId={resolvedCampaignId} currentUser={currentUser} users={users} />

            <div className="dm-side">
                <div className="monsters">
                    <div className="monsters-content">
                        <div className="monsters-title-content">
                            <p>Monsters</p>
                        </div>
                        <div className="monsters-token-content">
                            {monsters.map((monster, index) => (
                                <div key={index} className="monster-token">
                                    {/* Will get the image from API */}
                                    <img

                                        className="dm-token-img"
                                        src={monster.fullData && monster.fullData.image
                                            ? `https://www.dnd5eapi.co${monster.fullData.image}`
                                            : addmonster}
                                        alt={monster.name}
                                        onClick={() => viewMonsterDetails(monster)}
                                    />
                                    <div className="monster-token-name">{monster.name}</div>
                                </div>
                            ))}
                            <button className="add-monsters" onClick={showTokenInfo}>
                                <img className="add-monsters-img" src={addmonster} alt="Add Monster" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="npcs">
                    <div className="npcs-content">
                        <div className="npcs-title-content">
                            <p>NPCs</p>
                        </div>
                        <div className="npcs-token-content">
                            <img className="img-frame" src="" alt=""></img>
                            <img className="dm-token-img" src="" alt=""></img>
                            <img className="img-frame" src="" alt=""></img>
                            {/* Is NPCs going to be created then and there or will it be based on a upload?*/}
                            <button className="add-npc" onClick={addNPC}>
                                <img className="add-npc-img" src={addnpc} alt="" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dmview-pcs">
                    <div className="pc-content">
                        <div className="pc-title-content">
                            <p>Player Characters</p>
                        </div>
                        <div className="pc-token-content">
                            <img className="img-frame" src="" alt=""></img>
                            <img className="dm-token-img" src="" alt=""></img>
                            <button className="view-pc" onClick={viewPC}>
                                <img className="view-pc-img" src={adventurer} alt="" />
                                {/* When room is created with players, it needs to populate from where ever the information is being stored.
                                        Program should then loop and fill it from the left side of "view-pc-img".
                                */}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="maps">
                    <div className="maps-content">
                        <div className="maps-title-content">
                            <p>Maps</p>
                        </div>
                        <div className="maps-token-content">
                            {/* Display uploaded maps */}
                            {maps.map(mapItem => (
  <div key={mapItem.name} className="map-item">
    <img
      className="map-thumbnail"
      src={mapItem.src}
      alt={mapItem.name}
      onClick={() => viewMapInfo(mapItem)}
    />
    <div className="map-name">{mapItem.name}</div>
  </div>
))}

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden-file-input"
                                accept="image/png"
                                onChange={handleFileSelect}
                            />

                            {/* When the button gets clicked, it allows the user to select a png they have from their device to be uploaded 
                                and stored (database). Then the user can expand and see this map
                                LATER IMPLEMENTATIONS: DMVIEW needs to communicate with GAMEVIEW to show the map selection it can do
                                 */}
                            <button className="dm-add-map" onClick={addMap}>
                                <img className="add-map-img" src={map} alt="" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Monster Search Modal */}
                {tokenInfoVisible && (
                    <div className="token-info-popup">
                        <div className="token-info-popup-top">
                            <div className="token-info-title">Add Monster</div>
                            <button
                                className="close-token-info"
                                onClick={hideTokenInfo}
                            >
                                x
                            </button>
                        </div>

                        <div className="token-info-popup-bottom">
                            <div className="monster-search-container" ref={searchRef}>
                                <div className="search-instructions">
                                    Search for Monster
                                </div>

                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="monster-search-input"
                                        placeholder="Search monsters (e.g., 'dragon', 'black', 'adult')..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                    />
                                </div>

                                {loading && (
                                    <div className="search-loading">Loading monsters...</div>
                                )}

                                {error && (
                                    <div className="search-error">Error: {error}</div>
                                )}

                                {showDropdown && filteredMonsters.length > 0 && (
                                    <ul className="search-results-dropdown">
                                        {filteredMonsters.map((monster) => (
                                            <li
                                                key={monster.index}
                                                className="search-result-item"
                                                onClick={() => fetchMonsterDetails(monster.index)}
                                            >
                                                {monster.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {searchTerm && showDropdown && filteredMonsters.length === 0 && !loading && (
                                    <div className="no-results">
                                        No monsters found matching '{searchTerm}'
                                    </div>
                                )}

                                {/* Create Custom Monster button commented out, could not get it to work, may not be needed, unless bending the rules?*/}
                                {/* <div className="search-options">
                                    <button className="custom-monster-btn" onClick={() => {
                                        addMonster();
                                        hideTokenInfo();
                                        upMonster();
                                    }}>
                                        Create Custom Monster
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Monster Details View */}
                <div className={selectedMonster ? "visible" : "invisible"} id="view-monster">
                    <div className="view-monster-top">
                        <div className="view-monster-title">{selectedMonster?.name}</div>
                        <button className="minimize-monster" onClick={minMonster}>-</button>
                    </div>

                    <div className="view-monster-bottom">
                        {selectedMonster && (
                            <>
                                <form className="monster-basics">
                                    <div className="monster-basics-top">
                                        <input
                                            type="text"
                                            name="monster-name"
                                            value={selectedMonster.name}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, name: e.target.value });
                                            }}
                                        />

                                        <div className="size-align">
                                            <input
                                                type="text"
                                                name="monster-size"
                                                value={selectedMonster.size}
                                                readOnly={!!selectedMonster.index}
                                                onChange={(e) => {
                                                    setSelectedMonster({ ...selectedMonster, size: e.target.value });
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="monster-alignment"
                                                value={selectedMonster.alignment}
                                                readOnly={!!selectedMonster.index}
                                                onChange={(e) => {
                                                    setSelectedMonster({ ...selectedMonster, alignment: e.target.value });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="monster-basics-bottom">
                                        <div className="stat-group">
                                            <label htmlFor="monster-ac">Armor Class:</label>
                                            <input
                                                type="text"
                                                id="monster-ac"
                                                name="monster-ac"
                                                value={selectedMonster.armor_class?.[0]?.value || selectedMonster.ac || ''}
                                                onChange={(e) => {
                                                    updateMonsterStat('ac', e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="stat-group">
                                            <label htmlFor="monster-hp">Hit Points:</label>
                                            <input
                                                type="text"
                                                id="monster-hp"
                                                name="monster-hp"
                                                value={selectedMonster.hit_points || selectedMonster.hp || ''}
                                                onChange={(e) => {
                                                    updateMonsterStat('hp', e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="stat-group">
                                            <label htmlFor="monster-spd">Speed:</label>
                                            <input
                                                type="text"
                                                id="monster-spd"
                                                name="monster-spd"
                                                value={
                                                    selectedMonster.speed
                                                        ? (typeof selectedMonster.speed === 'object'
                                                            ? Object.entries(selectedMonster.speed)
                                                                .map(([type, value]) => `${type} ${value}`)
                                                                .join(', ')
                                                            : selectedMonster.speed)
                                                        : selectedMonster.spd || ''
                                                }
                                                onChange={(e) => {
                                                    updateMonsterStat('spd', e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="monster-stats">
                                    <div>
                                        <div>STR</div>
                                        <input
                                            type="text"
                                            name="monster-str"
                                            value={selectedMonster.strength || selectedMonster.str}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, strength: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>DEX</div>
                                        <input
                                            type="text"
                                            name="monster-dex"
                                            value={selectedMonster.dexterity || selectedMonster.dex}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, dexterity: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CON</div>
                                        <input
                                            type="text"
                                            name="monster-con"
                                            value={selectedMonster.constitution || selectedMonster.con}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, constitution: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>INT</div>
                                        <input
                                            type="text"
                                            name="monster-int"
                                            value={selectedMonster.intelligence || selectedMonster.int}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, intelligence: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>WIS</div>
                                        <input
                                            type="text"
                                            name="monster-wis"
                                            value={selectedMonster.wisdom || selectedMonster.wis}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, wisdom: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CHA</div>
                                        <input
                                            type="text"
                                            name="monster-cha"
                                            value={selectedMonster.charisma || selectedMonster.cha}
                                            readOnly={!!selectedMonster.index}
                                            onChange={(e) => {
                                                setSelectedMonster({ ...selectedMonster, charisma: e.target.value });
                                            }}
                                        />
                                    </div>
                                </form>

                                {selectedMonster.index && (
                                    <form className="monster-details">
                                        {selectedMonster.proficiencies && selectedMonster.proficiencies.some(prof => prof.proficiency.name.includes('Saving Throw')) && (
                                            <div>
                                                Saving Throws
                                                <input
                                                    type="text"
                                                    name="monster-saves"
                                                    value={selectedMonster.proficiencies
                                                        .filter(prof => prof.proficiency.name.includes('Saving Throw'))
                                                        .map(prof => `${prof.proficiency.name.split(':')[1].trim()} +${prof.value}`)
                                                        .join(', ')}
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {selectedMonster.proficiencies && selectedMonster.proficiencies.some(prof => prof.proficiency.name.includes('Skill')) && (
                                            <div>
                                                Skills
                                                <input
                                                    type="text"
                                                    name="monster-skills"
                                                    value={selectedMonster.proficiencies
                                                        .filter(prof => prof.proficiency.name.includes('Skill'))
                                                        .map(prof => `${prof.proficiency.name.split(':')[1].trim()} +${prof.value}`)
                                                        .join(', ')}
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {selectedMonster.senses && (
                                            <div>
                                                Senses
                                                <input
                                                    type="text"
                                                    name="monster-senses"
                                                    value={Object.entries(selectedMonster.senses)
                                                        .map(([sense, value]) => `${sense.replace(/_/g, ' ')} ${value}`)
                                                        .join(', ')}
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {selectedMonster.languages && (
                                            <div>
                                                Languages
                                                <input
                                                    type="text"
                                                    name="monster-languages"
                                                    value={selectedMonster.languages}
                                                    readOnly
                                                />
                                            </div>
                                        )}

                                        {selectedMonster.challenge_rating !== undefined && (
                                            <div>
                                                Challenge
                                                <input
                                                    type="text"
                                                    name="monster-challenge"
                                                    value={`${selectedMonster.challenge_rating} (${selectedMonster.xp.toLocaleString()} XP)`}
                                                    readOnly
                                                />
                                            </div>
                                        )}
                                    </form>
                                )}

                                {!selectedMonster.index && (
                                    <form className="monster-details">
                                        <div>
                                            Saving Throws
                                            <input
                                                type="text"
                                                name="monster-saves"
                                                placeholder="Add Saves..."
                                            />
                                        </div>
                                        <div>
                                            Skills
                                            <input
                                                type="text"
                                                name="monster-skills"
                                                placeholder="Add Skills..."
                                            />
                                        </div>
                                        <div>
                                            Senses
                                            <input
                                                type="text"
                                                name="monster-senses"
                                                placeholder="Add Senses..."
                                            />
                                        </div>
                                        <div>
                                            Languages
                                            <input
                                                type="text"
                                                name="monster-languages"
                                                placeholder="Add Languages..."
                                            />
                                        </div>
                                        <div>
                                            Challenge
                                            <input
                                                type="text"
                                                name="monster-challenge"
                                                placeholder="Add Challenge Rating..."
                                            />
                                        </div>
                                    </form>
                                )}

                                {/* Special Abilities */}
                                {selectedMonster.index && selectedMonster.special_abilities && selectedMonster.special_abilities.length > 0 && (
                                    <div className="monster-abilities">
                                        <p>Abilities</p>
                                        {selectedMonster.special_abilities.map((ability, index) => (
                                            <div key={index} className="monster-ability-item">
                                                <input
                                                    type="text"
                                                    name={`monster-ability-name-${index}`}
                                                    value={ability.name}
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    name={`monster-ability-${index}`}
                                                    value={ability.desc}
                                                    readOnly
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!selectedMonster.index && (
                                    <form className="monster-abilities">
                                        <p>Abilities</p>
                                        <input type="text" name="monster-ability-name" placeholder="Name..." />
                                        <input type="text" name="monster-ability" placeholder="Descr..." />
                                        <button id="new-monster-ability">+</button>
                                    </form>
                                )}

                                {/* Actions */}
                                <h1>Actions</h1>
                                {selectedMonster.index && selectedMonster.actions && selectedMonster.actions.length > 0 && (
                                    <div className="monster-actions">
                                        {selectedMonster.actions.map((action, index) => (
                                            <div key={index} className="monster-action-item">
                                                <input
                                                    type="text"
                                                    name={`monster-action-name-${index}`}
                                                    value={action.name}
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    name={`monster-action-${index}`}
                                                    value={action.desc}
                                                    readOnly
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {!selectedMonster.index && (
                                    <form className="monster-actions-form">
                                        <input type="text" name="monster-action-name" placeholder="Name..." />
                                        <input type="text" name="monster-action" placeholder="Descr..." />
                                        <button id="new-monster-action">+</button>
                                    </form>
                                )}

                                {/* Legendary Actions */}
                                {selectedMonster.index && selectedMonster.legendary_actions && selectedMonster.legendary_actions.length > 0 && (
                                    <div className="monster-legendary-actions">
                                        <h1>Legendary Actions</h1>
                                        <p className="legendary-description">
                                            The {selectedMonster.name.toLowerCase()} can take 3 legendary actions, choosing from the options below.
                                            Only one legendary action option can be used at a time and only at the end of another creature's turn.
                                            The {selectedMonster.name.toLowerCase()} regains spent legendary actions at the start of its turn.
                                        </p>
                                        {selectedMonster.legendary_actions.map((action, index) => (
                                            <div key={index} className="monster-legendary-action-item">
                                                <input
                                                    type="text"
                                                    name={`monster-legendary-action-name-${index}`}
                                                    value={action.name}
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    name={`monster-legendary-action-${index}`}
                                                    value={action.desc}
                                                    readOnly
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reactions */}
                                {selectedMonster.index && selectedMonster.reactions && selectedMonster.reactions.length > 0 && (
                                    <>
                                        <h1>Reactions</h1>
                                        <div className="monster-reactions">
                                            {selectedMonster.reactions.map((reaction, index) => (
                                                <div key={index} className="monster-reaction-item">
                                                    <input
                                                        type="text"
                                                        name={`monster-reaction-name-${index}`}
                                                        value={reaction.name}
                                                        readOnly
                                                    />
                                                    <input
                                                        type="text"
                                                        name={`monster-reaction-${index}`}
                                                        value={reaction.desc}
                                                        readOnly
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {!selectedMonster.index && (
                                    <>
                                        <h1>Reactions</h1>
                                        <form className="monster-reactions-form">
                                            <input type="text" name="monster-reaction-name" placeholder="Name..." />
                                            <input type="text" name="monster-reaction" placeholder="Descr..." />
                                            <button id="new-monster-reaction">+</button>
                                        </form>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Map Info Popup */}
                {mapInfoVisible && selectedMap && (
                    <div className="map-info-popup">
                        <div className="map-info-popup-top">
                            <div className="map-info-title">{selectedMap.name}</div>
                            <button
                                className="close-map-info"
                                onClick={closeMapInfo}
                            >
                                x
                            </button>
                        </div>

                        <div className="map-info-popup-bottom">
                            <img
                                className="map-info-image"
                                src={selectedMap.src}
                                alt={selectedMap.name}
                            />
                        </div>
                    </div>
                )}


                {/* Did not end up using this, maybe delete later */}
                <div className="view-pc">
                    {/* existing view-pc content */}
                </div>

                <div className="map-list">
                    {/* existing map-list content */}
                </div>
            </div>
        </>
    )
}

export default DMView;
