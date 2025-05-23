import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
import { useState, useEffect, useRef } from "react";
import wizard from "../asset/prof-pics/wizard.png";
import map from "../asset/gameside/minimap.png";
import adventurer from "../asset/dmside/adventurer.png";
import addmonster from "../asset/dmside/add-monster.png";
import addnpc from "../asset/dmside/add-npc.png";

// Accept both monsters/setMonsters and npcs/setNpcs props
const DMView = ({ monsters, setMonsters, npcs, setNpcs, maps = [], setMaps }) => {
    // State management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMonster, setSelectedMonster] = useState(null);
    const [mapInfoVisible, setMapInfoVisible] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);
    const [selectedNpc, setSelectedNpc] = useState(null); // To store the currently selected NPC

    // Refs
    const fileInputRef = useRef(null);
    const monsterImageRef = useRef(null);
    const npcImageRef = useRef(null);

    // Log for debugging
    useEffect(() => {
        console.log("NPCs in DMView:", npcs);
    }, [npcs]);

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
                    id: Date.now().toString(), // Unique ID for the map
                    src: e.target.result, // Base64 data URL of the image
                    name: file.name
                };
                console.log("Adding new map:", newMap);
                setMaps([...maps, newMap]); // Update the maps state in App.js
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a PNG image file.');
        }

        // Reset the file input value to allow re-uploading the same file
        event.target.value = '';
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

        // Reset the file input value to allow re-uploading the same file
        event.target.value = '';
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

        // Reset the file input value to allow re-uploading the same file
        event.target.value = '';
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

    function deleteMap(id) {
        setMaps((prevMaps) => prevMaps.filter((map) => map.id !== id));
    }

    // Add a new custom monster
    function addMonster() {
        const newMonster = {
            id: Date.now().toString(),
            name: "New Monster",
            size: "(Size)",
            alignment: "(Alignment)",
            ac: "10",
            hp: "10",
            spd: "30 ft",
            str: "10",
            dex: "10",
            con: "10",
            int: "10",
            wis: "10",
            cha: "10",
            abilities: "",
            actions: "",
            legendary_actions: "",
            reactions: "",
            imageUrl: addmonster
        };

        console.log("Adding new monster:", newMonster);

        setMonsters((prevMonsters) => {
            const updatedMonsters = [...prevMonsters, newMonster];
            console.log("Updated monsters in DMView:", updatedMonsters);
            return updatedMonsters;
        });
        
        // Show the monster view panel with the monster data
        setSelectedMonster({
            name: newMonster.name,
            size: newMonster.size,
            alignment: newMonster.alignment,
            armor_class: [{ value: newMonster.ac }],
            hit_points: newMonster.hp,
            speed: newMonster.spd,
            strength: newMonster.str,
            dexterity: newMonster.dex,
            constitution: newMonster.con,
            intelligence: newMonster.int,
            wisdom: newMonster.wis,
            charisma: newMonster.cha,
            abilities: newMonster.abilities,
            actions: newMonster.actions,
            legendary_actions: newMonster.legendary_actions,
            reactions: newMonster.reactions,
            imageUrl: newMonster.imageUrl,
            originalId: newMonster.id
        });
        upMonster();
    }

    // Add a new custom NPC (using the old implementation)
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

    // View a specific NPC's details (using the old implementation)
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
        console.log(`Updating monster ${statName} to ${value}`);
        
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

    // Update NPC stats (using the old implementation)
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
        setMonsters((prevMonsters) => prevMonsters.filter((monster) => monster.id !== id));
        setSelectedMonster(null); // Clear the selected monster after deletion
    }

    // Delete an NPC
    function deleteNpc(id) {
        setNpcs((prevNpcs) => prevNpcs.filter((npc) => npc.id !== id));
        setSelectedNpc(null); // Clear the selected NPC after deletion
    }

    return (
        <>
            <Nav />
            <GameView monsters={monsters} setMonsters={setMonsters} npcs={npcs} setNpcs={setNpcs} />

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
                                onClick={() => viewMapInfo(mapItem)} // Set the selected map
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

                    {/* Add Map Button */}
                    <button className="dm-add-map" onClick={addMap}>
                        <img className="add-map-img" src={map} alt="Add Map" />
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
                                                placeholder="Write Size..."
                                                type="text"
                                                name="monster-size"
                                                value={selectedMonster.size}
                                                onChange={(e) => {
                                                    updateMonsterStat('size', e.target.value);
                                                }}
                                            />
                                            <input
                                                placeholder="Write Alignment..."
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

                                {/**Delete Button to delete selected viewing mosnter token*/}
                                <button 
                                    className="monster-delete-token"
                                    onClick={() => {
                                        deleteMonster(selectedMonster.originalId);
                                        minMonster();
                                    }}
                                    >
                                        Delete Monster
                                    </button>
                            </>
                        )}
                    </div>
                </div>

                {/* NPC Details View - Using the old implementation */}
                <div className={selectedNpc ? "visible" : "invisible"} id="view-npc">
                    <div className="view-npc-top">
                        <input
                            type="text"
                            className="view-npc-title"
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
                                                value={selectedNpc.role || ''}
                                                onChange={(e) => {
                                                    updateNpcStat('role', e.target.value);
                                                }}
                                                placeholder="Write Role..."
                                            />
                                            <input
                                                type="text"
                                                name="npc-alignment"
                                                value={selectedNpc.alignment || ''}
                                                onChange={(e) => {
                                                    updateNpcStat('alignment', e.target.value);
                                                }}
                                                placeholder="Write Alignment..."
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="npc-stats">
                                    <h3>Description</h3>
                                    <textarea
                                        name="npc-description"
                                        className="npc-textarea"
                                        placeholder="Add NPC description here..."
                                        value={selectedNpc.description || ''}
                                        onChange={(e) => {
                                            updateNpcStat('description', e.target.value);
                                        }}
                                    />
                                </form>

                                {/* Delete Button for NPC */}
                                <button
                                    className="npc-delete-token"
                                    onClick={() => {
                                        deleteNpc(selectedNpc.originalId);
                                        minNpc(); // Minimize the NPC view after deletion
                                    }}
                                >
                                    Delete NPC
                                </button>
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
                            {/* Delete Map Button */}
                            <button
                                className="map-info-delete-image"
                                onClick={() => {
                                    deleteMap(selectedMap.id);
                                    closeMapInfo(); // Close the map info popup after deletion
                                }}
                            >
                                Delete Map
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default DMView;
