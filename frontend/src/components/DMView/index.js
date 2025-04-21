// The key changes are in the viewMonsterDetails function and the input fields
// for AC, HP, and Speed to make them editable and update the state correctly
import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
import { useState, useEffect, useRef } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import map from "../asset/gameside/minimap.png";
import adventurer from "../asset/dmside/adventurer.png";
import addmonster from "../asset/dmside/add-monster.png";
import addnpc from "../asset/dmside/add-npc.png";

const DMView = () => {
    // State management
    const [monsters, setMonsters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMonster, setSelectedMonster] = useState(null);
    const [maps, setMaps] = useState([]); // To store map images
    const [mapInfoVisible, setMapInfoVisible] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);
    const [npcs, setNpcs] = useState([]); // To store NPC tokens
    const [selectedNpc, setSelectedNpc] = useState(null); // To store the currently selected NPC

    // Refs
    const fileInputRef = useRef(null);
    const monsterImageRef = useRef(null);
    const npcImageRef = useRef(null);

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

    function upNpc() {
        const viewNpc = document.getElementById('view-npc');
        if (viewNpc) {
            viewNpc.className = "visible";
        }
    }

    function minNpc() {
        const viewNpc = document.getElementById('view-npc');
        if (viewNpc) {
            viewNpc.className = "invisible";
        }
    }

    function viewPC() {
        // Your existing function
    }

    // Function to handle file selection for maps
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();

            reader.onload = (e) => {
                const newMap = {
                    id: Date.now(), // Unique ID for the map
                    src: e.target.result, // Base64 data URL of the image
                    name: file.name
                };

                setMaps([...maps, newMap]);
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a PNG image file.');
        }
    }

    // Function to handle monster image selection
    function handleMonsterImageSelect(event) {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // Update the selectedMonster with the image
                setSelectedMonster(prevMonster => ({
                    ...prevMonster,
                    imageUrl: e.target.result
                }));

                // Also update the monster in the monsters array
                setMonsters(prevMonsters => {
                    return prevMonsters.map(m => {
                        if (m.id === selectedMonster.originalId) {
                            return {
                                ...m,
                                imageUrl: e.target.result
                            };
                        }
                        return m;
                    });
                });
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a PNG or JPEG image file.');
        }
    }

    // Function to handle NPC image selection
    function handleNpcImageSelect(event) {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                // Update the selected NPC with the image
                setSelectedNpc(prevNpc => ({
                    ...prevNpc,
                    imageUrl: e.target.result
                }));

                // Also update the NPC in the NPCs array
                setNpcs(prevNpcs => {
                    return prevNpcs.map(n => {
                        if (n.id === selectedNpc.originalId) {
                            return {
                                ...n,
                                imageUrl: e.target.result
                            };
                        }
                        return n;
                    });
                });
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a PNG or JPEG image file.');
        }
    }

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

    // Add a new custom monster
    function addMonster() {
        // Create a new blank monster with default placeholder values
        const monster = {
            name: "New Monster",
            size: "Medium",
            alignment: "Neutral",
            armor_class: [{ value: "10" }],
            hit_points: "10",
            speed: "walk: 30 ft",
            strength: "10",
            dexterity: "10",
            constitution: "10",
            intelligence: "10",
            wisdom: "10",
            charisma: "10",
            abilities: "",
            actions: "",
            legendary_actions: "",
            reactions: "",
            imageUrl: addmonster // Default to the add monster image
        };

        // Add to monsters state
        const newMonster = {
            id: Date.now().toString(), // Generate a unique ID
            name: monster.name,
            size: monster.size,
            alignment: monster.alignment,
            ac: monster.armor_class[0].value,
            hp: monster.hit_points,
            spd: monster.speed,
            str: monster.strength,
            dex: monster.dexterity,
            con: monster.constitution,
            int: monster.intelligence,
            wis: monster.wisdom,
            cha: monster.charisma,
            abilities: monster.abilities,
            actions: monster.actions,
            legendary_actions: monster.legendary_actions,
            reactions: monster.reactions,
            imageUrl: monster.imageUrl
        };
        
        setMonsters(prevMonsters => [...prevMonsters, newMonster]);

        // Show the monster view panel with the monster data
        setSelectedMonster({...monster, originalId: newMonster.id});
        upMonster();
    }

    // Add a new custom NPC
    function addNpc() {
        // Create a new blank NPC with default placeholder values
        const npc = {
            name: "New NPC",
            role: "Villager",
            alignment: "Neutral",
            description: "",
            imageUrl: addnpc // Default to the add NPC image
        };

        // Add to NPCs state
        const newNpc = {
            id: Date.now().toString(), // Generate a unique ID
            name: npc.name,
            role: npc.role,
            alignment: npc.alignment,
            description: npc.description,
            imageUrl: npc.imageUrl
        };

        setNpcs(prevNpcs => [...prevNpcs, newNpc]);

        // Show the NPC view panel with the NPC data
        setSelectedNpc({ ...npc, originalId: newNpc.id });
        upNpc(); // Function to make the NPC popup visible
    }

    // View a specific monster's details
    function viewMonsterDetails(monster) {
        // Create a monster object with editable properties
        const monsterDetails = {
            name: monster.name,
            size: monster.size,
            alignment: monster.alignment,
            armor_class: [{ value: monster.ac }],
            hit_points: monster.hp,
            speed: monster.spd,
            strength: monster.str,
            dexterity: monster.dex,
            constitution: monster.con,
            intelligence: monster.int,
            wisdom: monster.wis,
            charisma: monster.cha,
            abilities: monster.abilities || "",
            actions: monster.actions || "",
            legendary_actions: monster.legendary_actions || "",
            reactions: monster.reactions || "",
            imageUrl: monster.imageUrl || addmonster,
            // Include reference to original monster for updating
            originalId: monster.id
        };
        
        setSelectedMonster(monsterDetails);
        upMonster();
    }

    // View a specific NPC's details
    function viewNpcDetails(npc) {
        // Create an NPC object with editable properties
        const npcDetails = {
            name: npc.name,
            role: npc.role,
            alignment: npc.alignment,
            description: npc.description || "",
            imageUrl: npc.imageUrl || addnpc,
            // Include reference to the original NPC for updating
            originalId: npc.id
        };

        setSelectedNpc(npcDetails); // Set the selected NPC
        upNpc(); // Make the NPC popup visible
    }

    // Update monster stats
    function updateMonsterStat(statName, value) {
        console.log(`Updating ${statName} to ${value}`);
        
        // Update the selected monster
        setSelectedMonster(prevMonster => {
            const updatedMonster = { ...prevMonster };
            
            // Handle different stat properties
            if (statName === 'ac') {
                updatedMonster.armor_class = [{ value }];
            } else if (statName === 'hp') {
                updatedMonster.hit_points = value;
            } else if (statName === 'spd') {
                updatedMonster.speed = value;
            } else if (statName === 'name') {
                updatedMonster.name = value;
            } else if (statName === 'size') {
                updatedMonster.size = value;
            } else if (statName === 'alignment') {
                updatedMonster.alignment = value;
            } else if (statName === 'str') {
                updatedMonster.strength = value;
            } else if (statName === 'dex') {
                updatedMonster.dexterity = value;
            } else if (statName === 'con') {
                updatedMonster.constitution = value;
            } else if (statName === 'int') {
                updatedMonster.intelligence = value;
            } else if (statName === 'wis') {
                updatedMonster.wisdom = value;
            } else if (statName === 'cha') {
                updatedMonster.charisma = value;
            } else if (statName === 'abilities') {
                updatedMonster.abilities = value;
            } else if (statName === 'actions') {
                updatedMonster.actions = value;
            } else if (statName === 'legendary_actions') {
                updatedMonster.legendary_actions = value;
            } else if (statName === 'reactions') {
                updatedMonster.reactions = value;
            }
            
            return updatedMonster;
        });

        // Update the monster in the monsters array
        setMonsters(prevMonsters => {
            return prevMonsters.map(m => {
                // Check if this is the monster we're updating
                if (m.id === selectedMonster.originalId) {
                    const updatedMonster = { ...m };
                    
                    // Update the direct property
                    if (statName === 'ac') {
                        updatedMonster.ac = value;
                    } else if (statName === 'hp') {
                        updatedMonster.hp = value;
                    } else if (statName === 'spd') {
                        updatedMonster.spd = value;
                    } else if (statName === 'name') {
                        updatedMonster.name = value;
                    } else if (statName === 'size') {
                        updatedMonster.size = value;
                    } else if (statName === 'alignment') {
                        updatedMonster.alignment = value;
                    } else if (statName === 'str') {
                        updatedMonster.str = value;
                    } else if (statName === 'dex') {
                        updatedMonster.dex = value;
                    } else if (statName === 'con') {
                        updatedMonster.con = value;
                    } else if (statName === 'int') {
                        updatedMonster.int = value;
                    } else if (statName === 'wis') {
                        updatedMonster.wis = value;
                    } else if (statName === 'cha') {
                        updatedMonster.cha = value;
                    } else if (statName === 'abilities') {
                        updatedMonster.abilities = value;
                    } else if (statName === 'actions') {
                        updatedMonster.actions = value;
                    } else if (statName === 'legendary_actions') {
                        updatedMonster.legendary_actions = value;
                    } else if (statName === 'reactions') {
                        updatedMonster.reactions = value;
                    }
                    
                    return updatedMonster;
                }
                return m;
            });
        });
    }

    // Update NPC stats
    function updateNpcStat(statName, value) {
        console.log(`Updating ${statName} to ${value}`);

        // Update the selected NPC
        setSelectedNpc(prevNpc => {
            const updatedNpc = { ...prevNpc };

            if (statName === 'name') {
                updatedNpc.name = value;
            } else if (statName === 'role') {
                updatedNpc.role = value;
            } else if (statName === 'alignment') {
                updatedNpc.alignment = value;
            } else if (statName === 'armor_class') {
                updatedNpc.armor_class = value;
            } else if (statName === 'hit_points') {
                updatedNpc.hit_points = value;
            } else if (statName === 'speed') {
                updatedNpc.speed = value;
            } else if (statName === 'strength') {
                updatedNpc.strength = value;
            } else if (statName === 'dexterity') {
                updatedNpc.dexterity = value;
            } else if (statName === 'constitution') {
                updatedNpc.constitution = value;
            } else if (statName === 'intelligence') {
                updatedNpc.intelligence = value;
            } else if (statName === 'wisdom') {
                updatedNpc.wisdom = value;
            } else if (statName === 'charisma') {
                updatedNpc.charisma = value;
            } else if (statName === 'description') {
                updatedNpc.description = value;
            }

            return updatedNpc;
        });

        // Update the NPC in the NPCs array
        setNpcs(prevNpcs => {
            return prevNpcs.map(n => {
                if (n.id === selectedNpc.originalId) {
                    return { ...n, [statName]: value };
                }
                return n;
            });
        });
    }

    // Delete a monster
    function deleteMonster(id) {
        setMonsters(monsters.filter((monster, index) => index !== id));
    }

    return (
        <>
            <Nav />
            <GameView />

            <div className="dm-side">
                <div className="monsters">
                    <div className="monsters-content">
                        <div className="monsters-title-content">
                            <p>Monsters</p>
                        </div>
                        <div className="monsters-token-content">
                            {monsters.map((monster, index) => (
                                <div key={index} className="monster-token">
                                    <img
                                        className="dm-token-img"
                                        src={monster.imageUrl || addmonster}
                                        alt={monster.name}
                                        onClick={() => viewMonsterDetails(monster)}
                                    />
                                    <div className="monster-token-name">{monster.name}</div>
                                </div>
                            ))}
                            <button className="add-monsters" onClick={addMonster}>
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
                            {npcs.map((npc, index) => (
                                <div key={index} className="npc-token">
                                    <img
                                        className="dm-token-img"
                                        src={npc.imageUrl || addnpc}
                                        alt={npc.name}
                                        onClick={() => viewNpcDetails(npc)}
                                    />
                                    <div className="npc-token-name">{npc.name}</div>
                                </div>
                            ))}
                            <button className="add-npc" onClick={addNpc}>
                                <img className="add-npc-img" src={addnpc} alt="Add NPC" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dmview-pcs">
                  {/* 
                      Team mentioned that it may end up getting deleted, so I commented it out for now
                      <div className="pc-content">
                        <div className="pc-title-content">
                            <p>Player Characters</p>
                        </div>
                        <div className="pc-token-content">
                            <img className="img-frame" src="" alt=""></img>
                            <img className="dm-token-img" src="" alt=""></img>
                            <button className="view-pc" onClick={viewPC}>
                                <img className="view-pc-img" src={adventurer} alt="" />
                                
                            </button>
                        </div>
                    </div>
                  
                  */}
                    
                </div>
                <div className="maps">
                    <div className="maps-content">
                        <div className="maps-title-content">
                            <p>Maps</p>
                        </div>
                        <div className="maps-token-content">
                            {/* Display uploaded maps */}
                            {maps.map(mapItem => (
                                <div key={mapItem.id} className="map-item">
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

                {/* Monster Details View */}
                <div className={selectedMonster ? "visible" : "invisible"} id="view-monster">
                    <div className="view-monster-top">
                        <input
                            type="text"
                            className="view-monster-title"
                            name="monster-title"
                            value={selectedMonster?.name || ''}
                            onChange={(e) => {
                                updateMonsterStat('name', e.target.value);
                            }}
                        />
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
                                            onChange={(e) => {
                                                updateMonsterStat('name', e.target.value);
                                            }}
                                        />

                                        <div className="monster-image-container">
                                            <img
                                                className="monster-basics-img"
                                                src={selectedMonster.imageUrl || addmonster}
                                                alt={selectedMonster.name}
                                            />
                                            <button 
                                                type="button"
                                                className="monster-basics-add-img"
                                                onClick={() => monsterImageRef.current.click()}
                                            >
                                                Change Image
                                            </button>
                                            <input
                                                type="file"
                                                ref={monsterImageRef}
                                                className="hidden-file-input"
                                                accept="image/png,image/jpeg"
                                                onChange={handleMonsterImageSelect}
                                            />
                                        </div>

                                        <div className="size-align">
                                            <input
                                                type="text"
                                                name="monster-size"
                                                value={selectedMonster.size}
                                                onChange={(e) => {
                                                    updateMonsterStat('size', e.target.value);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="monster-alignment"
                                                value={selectedMonster.alignment}
                                                onChange={(e) => {
                                                    updateMonsterStat('alignment', e.target.value);
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
                                                value={selectedMonster.armor_class?.[0]?.value || ''}
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
                                                value={selectedMonster.hit_points || ''}
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
                                                        : ''
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
                                            value={selectedMonster.strength || selectedMonster.str || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('str', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>DEX</div>
                                        <input
                                            type="text"
                                            name="monster-dex"
                                            value={selectedMonster.dexterity || selectedMonster.dex || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('dex', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CON</div>
                                        <input
                                            type="text"
                                            name="monster-con"
                                            value={selectedMonster.constitution || selectedMonster.con || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('con', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>INT</div>
                                        <input
                                            type="text"
                                            name="monster-int"
                                            value={selectedMonster.intelligence || selectedMonster.int || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('int', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>WIS</div>
                                        <input
                                            type="text"
                                            name="monster-wis"
                                            value={selectedMonster.wisdom || selectedMonster.wis || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('wis', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CHA</div>
                                        <input
                                            type="text"
                                            name="monster-cha"
                                            value={selectedMonster.charisma || selectedMonster.cha || ''}
                                            onChange={(e) => {
                                                updateMonsterStat('cha', e.target.value);
                                            }}
                                        />
                                    </div>
                                </form>

                                {/* Monster Details - Made Editable */}
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

                                {/* Special Abilities - Single Textarea */}
                                <form className="monster-abilities">
                                    <p>Abilities</p>
                                    <textarea
                                        name="monster-abilities-input"
                                        className="monster-textarea"
                                        placeholder="Add monster abilities here..."
                                        value={selectedMonster.abilities || ''}
                                        onChange={(e) => {
                                            updateMonsterStat('abilities', e.target.value);
                                        }}
                                    />
                                </form>

                                {/* Actions - Single Textarea */}
                                <h1>Actions</h1>
                                <form className="monster-actions-form">
                                    <textarea
                                        name="monster-actions-input"
                                        className="monster-textarea"
                                        placeholder="Add monster actions here..."
                                        value={selectedMonster.actions || ''}
                                        onChange={(e) => {
                                            updateMonsterStat('actions', e.target.value);
                                        }}
                                    />
                                </form>

                                {/* Legendary Actions - Single Textarea */}
                                <h1>Legendary Actions</h1>
                                <form className="monster-legendary-form">
                                    <textarea
                                        name="monster-legendary-input"
                                        className="monster-textarea"
                                        placeholder="Add legendary actions here..."
                                        value={selectedMonster.legendary_actions || ''}
                                        onChange={(e) => {
                                            updateMonsterStat('legendary_actions', e.target.value);
                                        }}
                                    />
                                </form>

                                {/* Reactions - Single Textarea */}
                                <h1>Reactions</h1>
                                <form className="monster-reactions-form">
                                    <textarea
                                        name="monster-reactions-input"
                                        className="monster-textarea" 
                                        placeholder="Add reactions here..."
                                        value={selectedMonster.reactions || ''}
                                        onChange={(e) => {
                                            updateMonsterStat('reactions', e.target.value);
                                        }}
                                    />
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* NPC Details View */}
                <div className={selectedNpc ? "visible" : "invisible"} id="view-npc">
                    <div className="view-npc-top">
                        <input
                            type="text"
                            className="npc-name-input"
                            name="npc-name"
                            value={selectedNpc?.name || ''}
                            onChange={(e) => {
                                updateNpcStat('name', e.target.value);
                            }}
                        />
                        <button className="minimize-npc" onClick={minNpc}>-</button>
                    </div>

                    <div className="view-npc-bottom">
                        {selectedNpc && (
                            <>
                                <form className="npc-basics">
                                    <div className="npc-basics-top">
                                        <div className="npc-image-container">
                                            <img
                                                className="npc-basics-img"
                                                src={selectedNpc.imageUrl || addnpc}
                                                alt={selectedNpc.name}
                                            />
                                            <button
                                                type="button"
                                                className="npc-basics-add-img"
                                                onClick={() => npcImageRef.current.click()}
                                            >
                                                Change Image
                                            </button>
                                            <input
                                                type="file"
                                                ref={npcImageRef}
                                                className="hidden-file-input"
                                                accept="image/png,image/jpeg"
                                                onChange={handleNpcImageSelect}
                                            />
                                        </div>

                                        <div className="npc-role-align">
                                            <input
                                                type="text"
                                                name="npc-role"
                                                value={selectedNpc.role}
                                                onChange={(e) => {
                                                    updateNpcStat('role', e.target.value);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                name="npc-alignment"
                                                value={selectedNpc.alignment}
                                                onChange={(e) => {
                                                    updateNpcStat('alignment', e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="npc-basics-bottom">
                                        <div className="stat-group">
                                            <label htmlFor="npc-ac">Armor Class:</label>
                                            <input
                                                type="text"
                                                id="npc-ac"
                                                name="npc-ac"
                                                value={selectedNpc.armor_class || ''}
                                                onChange={(e) => {
                                                    updateNpcStat('armor_class', e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="stat-group">
                                            <label htmlFor="npc-hp">Hit Points:</label>
                                            <input
                                                type="text"
                                                id="npc-hp"
                                                name="npc-hp"
                                                value={selectedNpc.hit_points || ''}
                                                onChange={(e) => {
                                                    updateNpcStat('hit_points', e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="stat-group">
                                            <label htmlFor="npc-spd">Speed:</label>
                                            <input
                                                type="text"
                                                id="npc-spd"
                                                name="npc-spd"
                                                value={selectedNpc.speed || ''}
                                                onChange={(e) => {
                                                    updateNpcStat('speed', e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="npc-stats">
                                    <div>
                                        <div>STR</div>
                                        <input
                                            type="text"
                                            name="npc-str"
                                            value={selectedNpc.strength || ''}
                                            onChange={(e) => {
                                                updateNpcStat('strength', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>DEX</div>
                                        <input
                                            type="text"
                                            name="npc-dex"
                                            value={selectedNpc.dexterity || ''}
                                            onChange={(e) => {
                                                updateNpcStat('dexterity', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CON</div>
                                        <input
                                            type="text"
                                            name="npc-con"
                                            value={selectedNpc.constitution || ''}
                                            onChange={(e) => {
                                                updateNpcStat('constitution', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>INT</div>
                                        <input
                                            type="text"
                                            name="npc-int"
                                            value={selectedNpc.intelligence || ''}
                                            onChange={(e) => {
                                                updateNpcStat('intelligence', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>WIS</div>
                                        <input
                                            type="text"
                                            name="npc-wis"
                                            value={selectedNpc.wisdom || ''}
                                            onChange={(e) => {
                                                updateNpcStat('wisdom', e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div>CHA</div>
                                        <input
                                            type="text"
                                            name="npc-cha"
                                            value={selectedNpc.charisma || ''}
                                            onChange={(e) => {
                                                updateNpcStat('charisma', e.target.value);
                                            }}
                                        />
                                    </div>
                                </form>

                                <form className="npc-details">
                                    <div>
                                        Description
                                        <textarea
                                            name="npc-description"
                                            className="npc-textarea"
                                            placeholder="Add NPC description here..."
                                            value={selectedNpc.description || ''}
                                            onChange={(e) => {
                                                updateNpcStat('description', e.target.value);
                                            }}
                                        />
                                    </div>
                                </form>
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
