import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createCharacter.scss"; // Import the CSS file for styling

const CreateCharacter = () => {
    const navigate = useNavigate(); // Hook to navigate between routes

    const [characterData, setCharacterData] = useState({
        name: "",
        character_class: "",
        species: "",
        background: "",
        level: 1,
        size: "",
        alignment: "",
        proficiency_bonus: 2,
        no_hit_dice: 1,
        per_level: 1,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        armor_class: 10,
        initiative: 0,
        speed: 30,
        hit_points: 10,
    });
    const userId = localStorage.getItem("user_id"); // Retrieve the user's ID from localStorage

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCharacterData({ ...characterData, [name]: value });
    };

    const handleCreateCharacter = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/characters/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...characterData, user_id: userId }), // Include user_id
            });
            if (response.ok) {
                const data = await response.json();
                alert("Character created successfully!");
                console.log(data.character);
            } else {
                alert("Failed to create character.");
            }
        } catch (error) {
            console.error("Error creating character:", error);
        }
    };

    return (
        <div className="create-character-container">
            <h1>Create a New Character</h1>
            <form className="create-character-form" onSubmit={handleCreateCharacter}>
                <label>
                    Name:
                    <input type="text" name="name" value={characterData.name} onChange={handleInputChange} required />
                </label>
                <label>
                    Character Class:
                    <input type="text" name="character_class" value={characterData.character_class} onChange={handleInputChange} required />
                </label>
                <label>
                    Species:
                    <input type="text" name="species" value={characterData.species} onChange={handleInputChange} required />
                </label>

                <div id="ability-scores">
    <input
        type="number"
        id="score-box"
        name="strength"
        value={characterData.strength}
        onChange={handleInputChange}
        required
        placeholder="Strength"
    />
    <input
        type="number"
        id="score-box"
        name="dexterity"
        value={characterData.dexterity}
        onChange={handleInputChange}
        required
        placeholder="Dexterity"
    />
    <input
        type="number"
        id="score-box"
        name="constitution"
        value={characterData.constitution}
        onChange={handleInputChange}
        required
        placeholder="Constitution"
    />
    <input
        type="number"
        id="score-box"
        name="intelligence"
        value={characterData.intelligence}
        onChange={handleInputChange}
        required
        placeholder="Intelligence"
    />
    <input
        type="number"
        id="score-box"
        name="wisdom"
        value={characterData.wisdom}
        onChange={handleInputChange}
        required
        placeholder="Wisdom"
    />
    <input
        type="number"
        id="score-box"
        name="charisma"
        value={characterData.charisma}
        onChange={handleInputChange}
        required
        placeholder="Charisma"
    />
</div>

                <label>
                    Armor Class:
                    <input type="number" name="armor_class" value={characterData.armor_class} onChange={handleInputChange} required />
                </label>
                <label>
                    Initiative:
                    <input type="number" name="initiative" value={characterData.initiative} onChange={handleInputChange} required />
                </label>
                <label>
                    Speed:
                    <input type="number" name="speed" value={characterData.speed} onChange={handleInputChange} required />
                </label>
                <label>
                    Hit Points:
                    <input type="number" name="hit_points" value={characterData.hit_points} onChange={handleInputChange} required />
                </label>

                <button type="submit">Create Character</button>
            </form>
            <button className="back-button" onClick={() => navigate("/home")}>Back</button>
        </div>
    );
};

export default CreateCharacter;