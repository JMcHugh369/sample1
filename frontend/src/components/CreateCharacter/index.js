import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            <form onSubmit={handleCreateCharacter}>
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
                <label>
                    Strength:
                    <input type="number" name="strength" value={characterData.strength} onChange={handleInputChange} required />
                </label>
                <label>
                    Dexterity:
                    <input type="number" name="dexterity" value={characterData.dexterity} onChange={handleInputChange} required />
                </label>
                <label>
                    Constitution:
                    <input type="number" name="constitution" value={characterData.constitution} onChange={handleInputChange} required />
                </label>
                <label>
                    Intelligence:
                    <input type="number" name="intelligence" value={characterData.intelligence} onChange={handleInputChange} required />
                </label>
                <label>
                    Wisdom:
                    <input type="number" name="wisdom" value={characterData.wisdom} onChange={handleInputChange} required />
                </label>
                <label>
                    Charisma:
                    <input type="number" name="charisma" value={characterData.charisma} onChange={handleInputChange} required />
                </label>
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
            <button onClick={() => navigate("/home")}>Back</button> {/* Navigate to the home page */}
        </div>
    );
};

export default CreateCharacter;