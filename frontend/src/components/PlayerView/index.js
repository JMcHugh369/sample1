import "./index.scss";
import Nav from "../Nav";
import GameView from "../GameView";
import str from "../asset/charsheet/str.png";
import dex from "../asset/charsheet/dex.png";
import con from "../asset/charsheet/constitution.png";
import int from "../asset/charsheet/int.png";
import wis from "../asset/charsheet/wis.png";
import cha from "../asset/charsheet/cha.png";
import ac from "../asset/charsheet/ac.png";
import perception from "../asset/charsheet/passive-perception.png";
import gold from "../asset/charsheet/gold.png";
import silver from "../asset/charsheet/silver.png";
import copper from "../asset/charsheet/copper.png";
import platinum from "../asset/charsheet/platinum.png";
import electrum from "../asset/charsheet/electrum.png";
import adventurer from "../asset/dmside/adventurer.png";
import speed from "../asset/charsheet/speed.png";
import initiativemod from "../asset/charsheet/initiativemod.png";
import inspoff from "../asset/charsheet/inspoff.png";
import inspon from "../asset/charsheet/insp-on-btn.png";
// import bagtop from "../asset/charsheet/bag-top.png";
import profbonus from "../asset/charsheet/profbonus.png";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const calculateModifier = (score) => {
    return Math.floor((score - 10) / 2);
};

const skillMapping = {
    acrobatics: "dexterity",
    animalHandling: "wisdom",
    arcana: "intelligence",
    athletics: "strength",
    deception: "charisma",
    history: "intelligence",
    insight: "wisdom",
    intimidation: "charisma",
    investigation: "intelligence",
    medicine: "wisdom",
    nature: "intelligence",
    perception: "wisdom",
    performance: "charisma",
    persuasion: "charisma",
    religion: "intelligence",
    sleightOfHand: "dexterity",
    stealth: "dexterity",
    survival: "wisdom",
};

const PlayerView = () => {
    const { campaignId, characterId } = useParams();
    const navigate = useNavigate();
    const [playerIds, setPlayerIds] = useState([]);
    const [character, setCharacter] = useState({
        name: "",
        level: "",
        species: "",
        character_class: "",
        background: "",
        platinum_coins: 0,
        gold_coins: 0,
        electrum: 0,
        silver_coins: 0,
        copper_coins: 0,
    });

    const [loading, setLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(null); // State to manage errors
    const [inspirationActive, setInspirationActive] = useState(false); // State to track inspiration status
    const [actions, setActions] = useState([]);
    const [spells, setSpells] = useState([]);
    const [proficiencies, setProficiencies] = useState([]);
    const [other, setOther] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [campaignIdState, setCampaignId] = useState(campaignId || null);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    // Add to your PlayerView state:
    const [features, setFeatures] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [extras, setExtras] = useState([]);

    const addFeature = async (name, description) => {
        try {
            const response = await fetch("http://localhost:5002/features", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to add feature");
            }
            const newFeature = await response.json();
            setFeatures((prev) => [...prev, newFeature]);
        } catch (err) {
            console.error("Error adding feature:", err.message);
        }
    };

    const deleteFeature = async (id) => {
        try {
            const response = await fetch(`http://localhost:5002/features/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete feature");
            }
            setFeatures((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            console.error("Error deleting feature:", err.message);
        }
    };

    // Fetch character data
    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                console.log("Fetching character data...");
                const response = await fetch(`http://localhost:5002/characters/${characterId}`);
                console.log("Response status:", response.status);
                if (!response.ok) {
                    throw new Error(`Character with ID ${characterId} not found`);
                }
                const data = await response.json();
                console.log("Fetched character data:", data); // Log the response
                console.log("character keys:", Object.keys(data.character));
                console.log("character object:", data.character);
                setCharacter(data.character);
                console.log("Character data set:", data.character);

                // Set campaignId and currentUser if available
                if (data.character.campaign_id) setCampaignId(data.character.campaign_id);
                console.log("user_id:", data.character.user_id, "username:", data.character.username);
                if (data.character.user_id && data.character.username) {
                    setCurrentUser({ id: data.character.user_id, username: data.character.username });
                }
            } catch (err) {
                console.error("Error fetching character:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (characterId) {
            fetchCharacter();
        } else {
            setLoading(false);
            setError("No character ID provided");
        }
    }, [characterId]);

    useEffect(() => {
        if (characterId) {
            fetchInventory();
        }
    }, [characterId]);

    useEffect(() => {
        if (!campaignIdState) return;
        fetch(`http://localhost:5002/campaigns/${campaignIdState}/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data.users || []);
                console.log("Fetched users for campaign:", data.users);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
            });
    }, [campaignIdState]);

    useEffect(() => {
        if (!campaignId) return;
        fetch(`http://localhost:5002/campaigns/${campaignId}/players`)
            .then(res => res.json())
            .then(data => {
                setPlayerIds(data.player_ids || []);
                console.log("Player IDs fetched from backend:", data.player_ids);
            })
            .catch(err => {
                console.error("Error fetching player IDs:", err);
            });
    }, [campaignId]);

    // Fetch on mount:
    useEffect(() => {
        if (characterId) {
            fetch(`http://localhost:5002/features/character/${characterId}`)
                .then(res => res.json()).then(setFeatures);
            fetch(`http://localhost:5002/backgrounds/character/${characterId}`)
                .then(res => res.json()).then(setBackgrounds);
            fetch(`http://localhost:5002/extras/character/${characterId}`)
                .then(res => res.json()).then(setExtras);
        }
    }, [characterId]);

    const fetchTabData = async (tabName) => {
        try {
            const response = await fetch(`http://localhost:5001/${tabName}/character/${characterId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${tabName}`);
            }
            const data = await response.json();
            if (tabName === "actions") setActions(data);
            if (tabName === "spells") setSpells(data);
            if (tabName === "proficiencies") setProficiencies(data);
            if (tabName === "other") setOther(data);
        } catch (err) {
            console.error(`Error fetching ${tabName}:`, err.message);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await fetch(`http://localhost:5001/inventory/character/${characterId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch inventory");
            }
            const data = await response.json();
            setInventory(data);
        } catch (err) {
            console.error("Error fetching inventory:", err.message);
        }
    };

    const createAction = async (name, description) => {
        try {
            const response = await fetch(`http://localhost:5001/actions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to create action");
            }
            const newAction = await response.json();
            setActions((prevActions) => [...prevActions, newAction]);
        } catch (err) {
            console.error("Error creating action:", err.message);
        }
    };

    const deleteAction = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/actions/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete action");
            }
            setActions((prevActions) => prevActions.filter((action) => action.id !== id));
        } catch (err) {
            console.error("Error deleting action:", err.message);
        }
    };

    const createSpell = async (name, description) => {
        try {
            const response = await fetch(`http://localhost:5001/spells`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to create spell");
            }
            const newSpell = await response.json();
            setSpells((prevSpells) => [...prevSpells, newSpell]);
        } catch (err) {
            console.error("Error creating spell:", err.message);
        }
    };

    const deleteSpell = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/spells/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete spell");
            }
            setSpells((prevSpells) => prevSpells.filter((spell) => spell.id !== id));
        } catch (err) {
            console.error("Error deleting spell:", err.message);
        }
    };

    const createProficiency = async (name, description) => {
        try {
            const response = await fetch(`http://localhost:5001/proficiencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to create proficiency");
            }
            const newProficiency = await response.json();
            setProficiencies((prevProficiencies) => [...prevProficiencies, newProficiency]);
        } catch (err) {
            console.error("Error creating proficiency:", err.message);
        }
    };

    const deleteProficiency = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/proficiencies/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete proficiency");
            }
            setProficiencies((prevProficiencies) => prevProficiencies.filter((proficiency) => proficiency.id !== id));
        } catch (err) {
            console.error("Error deleting proficiency:", err.message);
        }
    };

    const createOther = async (name, description) => {
        try {
            const response = await fetch(`http://localhost:5001/others`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to create other");
            }
            const newOther = await response.json();
            setOther((prevOther) => [...prevOther, newOther]);
        } catch (err) {
            console.error("Error creating other:", err.message);
        }
    };

    const deleteOther = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/others/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete other");
            }
            setOther((prevOther) => prevOther.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Error deleting other:", err.message);
        }
    };

    const createInventoryItem = async (name, description) => {
        try {
            const response = await fetch(`http://localhost:5001/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ character_id: characterId, name, description }),
            });
            if (!response.ok) {
                throw new Error("Failed to create inventory item");
            }
            const newItem = await response.json();
            setInventory((prevInventory) => [...prevInventory, newItem]);
        } catch (err) {
            console.error("Error creating inventory item:", err.message);
        }
    };

    const deleteInventoryItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/inventory/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete inventory item");
            }
            setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Error deleting inventory item:", err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCharacter({ ...character, [name]: value });
    };

    const calculateSkillValue = (skill) => {
        const ability = skillMapping[skill]; // e.g., "dexterity"
        const score = Number(character[ability]) || 0;
        const modifier = Math.floor((score - 10) / 2);
        const proficiencyBonus = Number(character.proficiency_bonus) || 0;
        // Always add proficiency bonus, since you don't track per-skill proficiency
        return modifier + proficiencyBonus;
    };

    if (loading) {
        return <p>Loading character data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";

        // Fetch data for the selected tab
        fetchTabData(tabName.toLowerCase());
    }

    const handleSaveCharacter = async () => {
        try {
            const response = await fetch(`http://localhost:5001/characters/${characterId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(character),
            });
            if (!response.ok) {
                throw new Error("Failed to save character");
            }
            alert("Character saved!");
        } catch (err) {
            alert("Error saving character: " + err.message);
        }
    };

    return (
        <>
            {/* Home Button */}
            <button
                id="home-button"
                onClick={() => navigate("/home")}
            >
                Home
            </button>
            <button
                id="save-button"
                onClick={handleSaveCharacter}
            >
                Save
            </button>

            {currentUser ? (
                <GameView
                    campaignId={campaignIdState}
                    currentUser={currentUser}
                    users={users}
                />
            ) : (
                <div>Loading player info...</div>
            )}

            <main>
                <div class="playerside">
                    <header className="sheet-header">
                        <img
                            className="sheet-pc-image"
                            src={character.image_url || adventurer} // Use character.image_url if available, fallback to adventurer
                            alt="Character"
                        />
                        <form>
                            <input
                                type="text"
                                className="char-name"
                                name="name"
                                placeholder="Name..."
                                value={character.name}
                                onChange={handleInputChange}
                            />
                        </form>
                        <p className="char-level">Level: {character.level || "1"}</p> {/* Display the level */}
                    </header>
                    <div class="header2">
                        <form>
                            <input
                                type="text"
                                class="char-class"
                                name="charClass"
                                placeholder="Class..."
                                value={character.character_class}
                                onChange={handleInputChange}
                            />
                        </form>
                        <form>
                            <input
                                type="text"
                                class="char-bg"
                                name="background"
                                placeholder="Background..."
                                value={character.background}
                                onChange={handleInputChange}
                            />
                        </form>
                    </div>



                    <sidebar class="abilities">
                        <div class="abil-img">
                            <img class="str-img" src={str} />
                            <img class="dex-img" src={dex} />
                            <img class="con-img" src={con} />
                            <img class="int-img" src={int} />
                            <img class="wis-img" src={wis} />
                            <img class="cha-img" src={cha} />
                            <img class="percep-img" src={perception} />
                        </div>

                        <form>
                            <input
                                type="text"
                                className="str-mod"
                                placeholder="0"
                                value={character.strength || ""}
                                onChange={(e) => setCharacter({ ...character, strength: e.target.value })}
                            />
                            <input
                                type="text"
                                className="str"
                                placeholder="0"
                                value={character.strength || ""}
                                onChange={(e) => setCharacter({ ...character, strength: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="dex-mod"
                                placeholder="0"
                                value={character.dexterity || ""}
                                onChange={(e) => setCharacter({ ...character, dexterity: e.target.value })}
                            />
                            <input
                                type="text"
                                className="dex"
                                placeholder="0"
                                value={character.dexterity || ""}
                                onChange={(e) => setCharacter({ ...character, dexterity: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="con-mod"
                                placeholder="0"
                                value={character.constitution || ""}
                                onChange={(e) => setCharacter({ ...character, constitution: e.target.value })}
                            />
                            <input
                                type="text"
                                className="con"
                                placeholder="0"
                                value={character.constitution || ""}
                                onChange={(e) => setCharacter({ ...character, constitution: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="int-mod"
                                placeholder="0"
                                value={character.intelligence || ""}
                                onChange={(e) => setCharacter({ ...character, intelligence: e.target.value })}
                            />
                            <input
                                type="text"
                                className="int"
                                placeholder="0"
                                value={character.intelligence || ""}
                                onChange={(e) => setCharacter({ ...character, intelligence: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="wis-mod"
                                placeholder="0"
                                value={character.wisdom || ""}
                                onChange={(e) => setCharacter({ ...character, wisdom: e.target.value })}
                            />
                            <input
                                type="text"
                                className="wis"
                                placeholder="0"
                                value={character.wisdom || ""}
                                onChange={(e) => setCharacter({ ...character, wisdom: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="cha-mod"
                                placeholder="0"
                                value={character.charisma || ""}
                                onChange={(e) => setCharacter({ ...character, charisma: e.target.value })}
                            />
                            <input
                                type="text"
                                className="cha"
                                placeholder="0"
                                value={character.charisma || ""}
                                onChange={(e) => setCharacter({ ...character, charisma: e.target.value })}
                            />
                        </form>

                        <form>
                            <input
                                type="text"
                                className="passive-perception"
                                placeholder="0"
                                value={character.passive_perception || ""}
                                onChange={(e) => setCharacter({ ...character, passive_perception: e.target.value })}
                            />
                        </form>

                    </sidebar>

                    <div className="top-middle">
                        <img className="ac-img" src={ac} />
                        <form>
                            <input
                                type="text"
                                className="ac"
                                placeholder="0"
                                value={character.armor_class || ""}
                                onChange={(e) => setCharacter({ ...character, armor_class: e.target.value })}
                            />
                        </form>
                        <img className="init-img" src={initiativemod} />
                        <form>
                            <input
                                type="text"
                                className="init"
                                placeholder="0"
                                value={character.initiative || ""}
                                onChange={(e) => setCharacter({ ...character, initiative: e.target.value })}
                            />
                        </form>
                        <img className="spd-img" src={speed} />
                        <form>
                            <input
                                type="text"
                                className="spd"
                                placeholder="0"
                                value={character.speed || ""}
                                onChange={(e) => setCharacter({ ...character, speed: e.target.value })}
                            />
                        </form>
                        <img className="prof-bonus-img" src={profbonus} />
                        <form>
                            <input
                                type="text"
                                className="prof-bonus"
                                placeholder="0"
                                value={character.proficiency_bonus || ""}
                                onChange={(e) => setCharacter({ ...character, proficiency_bonus: e.target.value })}
                            />
                        </form>

                        <div className="inspiration-container">
                            <button
                                className="inspiration"
                                onClick={() => setInspirationActive(!inspirationActive)} // Toggle the state
                            >
                                <img
                                    className="inspiration-img"
                                    src={inspirationActive ? inspon : inspoff} // Dynamically change the image based on state
                                    alt="Inspiration"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="skills">
                        <ul>
                            {Object.keys(skillMapping).map((skill) => (
                                <li key={skill}>
                                    <input
                                        className="skill-num"
                                        type="text"
                                        placeholder="0"
                                        value={calculateSkillValue(skill)}
                                        readOnly
                                    />{" "}
                                    {skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1')}
                                    ({skillMapping[skill].charAt(0).toUpperCase() + skillMapping[skill].slice(1)})
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div class="center-center">
                        <div class="hp-container">
                            <p>Hit Points</p>
                            <input
                                type="text"
                                className="curr-hp"
                                placeholder="0"
                                value={character.current_hp || ""}
                                onChange={e => setCharacter({ ...character, current_hp: e.target.value })}
                            />/<span>
                                <input
                                    type="text"
                                    className="max-hp"
                                    placeholder="0"
                                    value={character.max_hp || ""}
                                    onChange={e => setCharacter({ ...character, max_hp: e.target.value })}
                                />
                            </span>
                            <br />
                            <input
                                type="text"
                                className="temp-hp"
                                placeholder="- -"
                                value={character.temp_hp || ""}
                                onChange={e => setCharacter({ ...character, temp_hp: e.target.value })}
                            />
                            <span className="temp">Temp HP</span>
                        </div>
                        <div className="center-other">
                            <input
                                type="text"
                                className="conditions"
                                placeholder="conditions..."
                                value={character.conditions || ""}
                                onChange={e => setCharacter({ ...character, conditions: e.target.value })}
                            />
                            <input
                                type="text"
                                className="defenses"
                                placeholder="defenses..."
                                value={character.defenses || ""}
                                onChange={e => setCharacter({ ...character, defenses: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bottom-center">

                        <div className="tab">
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Actions")
                                }
                            }
                            >Actions</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Spells")
                                }
                            }
                            >Spells</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Proficiencies")
                                }
                            }>Proficiencies</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Other")
                                }
                            }>Other</button>
                        </div>

                        <div id="Actions" className="tabcontent">
                            <h3>Actions</h3>
                            <ul>
                                {actions.map((action) => (
                                    <li key={action.id}>
                                        <strong>{action.name}</strong>: {action.description}
                                        <button onClick={() => deleteAction(action.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createAction(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Spells" className="tabcontent">
                            <h3>Spells</h3>
                            <ul>
                                {spells.map((spell) => (
                                    <li key={spell.id}>
                                        <strong>{spell.name}</strong>: {spell.description}
                                        <button onClick={() => deleteSpell(spell.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createSpell(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Proficiencies" className="tabcontent">
                            <h3>Proficiencies</h3>
                            <ul>
                                {proficiencies.map((proficiency) => (
                                    <li key={proficiency.id}>
                                        <strong>{proficiency.name}</strong>: {proficiency.description}
                                        <button onClick={() => deleteProficiency(proficiency.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createProficiency(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Other" className="tabcontent">
                            <h3>Other</h3>
                            <ul>
                                {other.map((item) => (
                                    <li key={item.id}>
                                        <strong>{item.name}</strong>: {item.description}
                                        <button onClick={() => deleteOther(item.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createOther(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                    </div>

                    <div className="inventory-container">
                        <div className="currency-img">
                            <img className="platinum-img" src={platinum} />
                            <img className="gold-img" src={gold} />
                            <img className="electrum-img" src={electrum} />
                            <img className="silver-img" src={silver} />
                            <img className="copper-img" src={copper} />
                        </div>
                        <div className="currency-name">
                            <p>P</p>
                            <p>G</p>
                            <p>E</p>
                            <p>S</p>
                            <p>C</p>
                        </div>
                        <div className="currency">
                            <input
                                type="text"
                                className="platinum"
                                placeholder="0"
                                value={character?.platinum_coins || ""}
                                onChange={(e) => setCharacter({ ...character, platinum_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="gold"
                                placeholder="0"
                                value={character?.gold_coins || ""}
                                onChange={(e) => setCharacter({ ...character, gold_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="electrum"
                                placeholder="0"
                                value={character?.electrum || ""}
                                onChange={(e) => setCharacter({ ...character, electrum: e.target.value })}
                            />
                            <input
                                type="text"
                                className="silver"
                                placeholder="0"
                                value={character?.silver_coins || ""}
                                onChange={(e) => setCharacter({ ...character, silver_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="copper"
                                placeholder="0"
                                value={character?.copper_coins || ""}
                                onChange={(e) => setCharacter({ ...character, copper_coins: e.target.value })}
                            />
                        </div>
                        <p>Inventory</p>
                        <ul id="inventory-items">
                            {inventory.map((item) => (
                                <li key={item.id}>
                                    <strong>{item.name}</strong>: {item.description}
                                    <button onClick={() => deleteInventoryItem(item.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const name = e.target.elements.name.value;
                                const description = e.target.elements.description.value;
                                createInventoryItem(name, description);
                                e.target.reset();
                            }}
                        >
                            <input id="item-description" type="text" name="name" placeholder="Name..." required />
                            <input id="item-description" type="text" name="description" placeholder="Description..." required />
                            <button type="submit">Add</button>
                        </form>
                    </div>

                    <div className="feature-container">
                        <p>Features/Traits</p>
                        <ul>
                            {features.map(f => (
                                <li key={f.id}>
                                    <strong>{f.name}</strong>: {f.description}
                                    <button onClick={() => deleteFeature(f.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={e => {
                            e.preventDefault();
                            addFeature(e.target.name.value, e.target.description.value);
                            e.target.reset();
                        }}>
                            <input type="text" name="name" placeholder="Name..." required />
                            <input type="text" name="description" placeholder="Description..." required />
                            <button type="submit">Add</button>
                        </form>
                    </div>

                    <div className="bottom-center">

                        <div className="tab">
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Actions")
                                }
                            }
                            >Actions</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Spells")
                                }
                            }
                            >Spells</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Proficiencies")
                                }
                            }>Proficiencies</button>
                            <button className="tablinks" onClick={

                                (event) => {
                                    openTab(event, "Other")
                                }
                            }>Other</button>
                        </div>

                        <div id="Actions" className="tabcontent">
                            <h3>Actions</h3>
                            <ul>
                                {actions.map((action) => (
                                    <li key={action.id}>
                                        <strong>{action.name}</strong>: {action.description}
                                        <button onClick={() => deleteAction(action.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createAction(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Spells" className="tabcontent">
                            <h3>Spells</h3>
                            <ul>
                                {spells.map((spell) => (
                                    <li key={spell.id}>
                                        <strong>{spell.name}</strong>: {spell.description}
                                        <button onClick={() => deleteSpell(spell.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createSpell(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Proficiencies" className="tabcontent">
                            <h3>Proficiencies</h3>
                            <ul>
                                {proficiencies.map((proficiency) => (
                                    <li key={proficiency.id}>
                                        <strong>{proficiency.name}</strong>: {proficiency.description}
                                        <button onClick={() => deleteProficiency(proficiency.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createProficiency(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                        <div id="Other" className="tabcontent">
                            <h3>Other</h3>
                            <ul>
                                {other.map((item) => (
                                    <li key={item.id}>
                                        <strong>{item.name}</strong>: {item.description}
                                        <button onClick={() => deleteOther(item.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.target.elements.name.value;
                                    const description = e.target.elements.description.value;
                                    createOther(name, description);
                                    e.target.reset();
                                }}
                            >
                                <input id="item-description" type="text" name="name" placeholder="Name..." required />
                                <input id="item-description" type="text" name="description" placeholder="Description..." required />
                                <button type="submit">Add</button>
                            </form>
                        </div>

                    </div>

                    <div className="inventory-container">
                        <div className="currency-img">
                            <img className="platinum-img" src={platinum} />
                            <img className="gold-img" src={gold} />
                            <img className="electrum-img" src={electrum} />
                            <img className="silver-img" src={silver} />
                            <img className="copper-img" src={copper} />
                        </div>
                        <div className="currency-name">
                            <p>P</p>
                            <p>G</p>
                            <p>E</p>
                            <p>S</p>
                            <p>C</p>
                        </div>
                        <div className="currency">
                            <input
                                type="text"
                                className="platinum"
                                placeholder="0"
                                value={character?.platinum_coins || ""}
                                onChange={(e) => setCharacter({ ...character, platinum_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="gold"
                                placeholder="0"
                                value={character?.gold_coins || ""}
                                onChange={(e) => setCharacter({ ...character, gold_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="electrum"
                                placeholder="0"
                                value={character?.electrum || ""}
                                onChange={(e) => setCharacter({ ...character, electrum: e.target.value })}
                            />
                            <input
                                type="text"
                                className="silver"
                                placeholder="0"
                                value={character?.silver_coins || ""}
                                onChange={(e) => setCharacter({ ...character, silver_coins: e.target.value })}
                            />
                            <input
                                type="text"
                                className="copper"
                                placeholder="0"
                                value={character?.copper_coins || ""}
                                onChange={(e) => setCharacter({ ...character, copper_coins: e.target.value })}
                            />
                        </div>
                        <p>Inventory</p>
                        <ul id="inventory-items">
                            {inventory.map((item) => (
                                <li key={item.id}>
                                    <strong>{item.name}</strong>: {item.description}
                                    <button onClick={() => deleteInventoryItem(item.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const name = e.target.elements.name.value;
                                const description = e.target.elements.description.value;
                                createInventoryItem(name, description);
                                e.target.reset();
                            }}
                        >
                            <input id="item-description" type="text" name="name" placeholder="Name..." required />
                            <input id="item-description" type="text" name="description" placeholder="Description..." required />
                            <button type="submit">Add</button>
                        </form>
                    </div>

                </div>
            </main>
        </>
    )
}

export default PlayerView;
