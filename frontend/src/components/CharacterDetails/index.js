import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CharacterDetails = () => {
    const { characterId } = useParams(); // Get the character ID from the URL
    const navigate = useNavigate(); // Hook to navigate between routes
    const [character, setCharacter] = useState(null); // State to store character data

    useEffect(() => {
        const fetchCharacterDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/characters/${characterId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCharacter(data.character); // Update the character state
                } else {
                    console.error("Failed to fetch character details");
                }
            } catch (error) {
                console.error("Error fetching character details:", error);
            }
        };

        fetchCharacterDetails();
    }, [characterId]);

    if (!character) {
        return <p>Loading character details...</p>;
    }

    return (
        <div className="character-details-container">
            <h1>{character.name}</h1>
            <p><strong>Class:</strong> {character.character_class}</p>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Background:</strong> {character.background}</p>
            <p><strong>Level:</strong> {character.level}</p>
            <p><strong>Size:</strong> {character.size}</p>
            <p><strong>Alignment:</strong> {character.alignment}</p>
            <p><strong>Proficiency Bonus:</strong> {character.proficiency_bonus}</p>
            <p><strong>Number of Hit Dice:</strong> {character.no_hit_dice}</p>
            <p><strong>Per Level:</strong> {character.per_level}</p>
            <button onClick={() => navigate("/home")}>Back</button> {/* Back button */}
        </div>
    );
};

export default CharacterDetails;