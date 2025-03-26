import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacters = async () => {
      const user_id = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
      if (!user_id) {
        alert('User ID is missing. Please log in again.');
        navigate('/login'); // Redirect to login page
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/get_characters?user_id=${user_id}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON response');
        }

        const data = await response.json();
        if (response.ok) {
          setCharacters(data.characters);
        } else {
          setError(data.message || 'Failed to fetch characters');
        }
      } catch (err) {
        console.error('Error fetching characters:', err);
        setError(err.message || 'An error occurred while fetching characters.');
      }
    };

    fetchCharacters();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this character?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/delete_character/${id}`, {
        method: 'DELETE',
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response');
      }

      const data = await response.json();
      if (response.ok) {
        alert('Character deleted successfully!');
        console.log('Character deleted successfully:', data);
        setCharacters((prev) => prev.filter((character) => character.id !== id)); // Update state instead of reloading
      } else {
        console.error('Failed to delete character:', data);
        alert(`Failed to delete character: ${data.message}`);
      }
    } catch (err) {
      console.error('Error deleting character:', err);
      alert('An error occurred while deleting the character.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div>
      <h1>Your Characters</h1>
      {error && <p>{error}</p>}
      {characters.length > 0 ? (
        <ul>
          {characters.map((character) => (
            <li key={character.id}>
              <strong>{character.name}</strong> - {character.race} {character.character_class} (Level {character.level})
              <button onClick={() => handleDelete(character.id)}>Delete</button> {/* Delete button */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters found.</p>
      )}
      <button onClick={handleBack}>Back</button> {/* Back button */}
    </div>
  );
};

export default ViewCharacters;
