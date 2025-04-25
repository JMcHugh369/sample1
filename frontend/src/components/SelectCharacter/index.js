import "./index.scss";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SelectCharacter = () => {
    const { campaignId } = useParams();
    const { characterId } = useParams();
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const navigate = useNavigate();

    // Fetch the user's characters
    useEffect(() => {
        const fetchCharacters = async () => {
            const userId = localStorage.getItem("user_id");
            try {
                const response = await fetch(`http://localhost:5001/characters/user/${userId}?campaignId=${campaignId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCharacters(data.characters);
                } else {
                    console.error("Failed to fetch characters");
                }
            } catch (error) {
                console.error("Error fetching characters:", error);
            }
        };

        fetchCharacters();
    }, [campaignId]); // This hook now depends on campaignId

    const handleCharacterSelect = (characterId) => {
        if (!characterId) {
            alert("Please select a character before proceeding.");
            return;
        }
        // When a character is selected:
        navigate(`/playerview/${campaignId}/${characterId}`); // Redirect to PlayerView with the characterId
    };

    return (
        <div className="select-character-container">
            <h1>Select a Character for Campaign {campaignId}</h1>
            <ul className="character-list">
                {characters.map((character) => (
                    <li
                        key={character.id}
                        className={`character-item ${selectedCharacter === character.id ? "selected" : ""}`}
                        onClick={() => {
                            console.log("Selected Character ID:", character.id);
                            setSelectedCharacter(character.id);
                        }}
                    >
                        <h3>{character.name}</h3>
                        <p>Class: {character.character_class}</p>
                        <p>Species: {character.species}</p>
                        <p>Level: {character.level}</p>
                    </li>
                ))}
            </ul>
            <button onClick={() => handleCharacterSelect(selectedCharacter)}>Confirm Selection</button>
        </div>
    );
};

export default SelectCharacter;