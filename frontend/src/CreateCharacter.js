import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCharacter = () => {
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    character_class: '',
    level: 1,
    background: '',
    alignment: '',
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    armor_class: 10,
    hit_points: 10,
    speed: 30,
    proficiency_bonus: 2,
    skills: '',
    saving_throws: '',
    equipment: '',
    features: '',
    spells: '',
    languages: '',
    notes: '',
    copper_coins: 0,
    silver_coins: 0,
    gold_coins: 0,
    platinum_coins: 0,
    inventory: '',
    total_weight: 0.0,
  });

  useEffect(() => {
    console.log('CreateCharacter component mounted');
    return () => {
      console.log('CreateCharacter component unmounted');
    };
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field updated: ${name} = ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert('Username is missing. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:5001/add_character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, username }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Expected JSON response');
      }

      const data = await response.json();
      if (response.ok) {
        alert('Character created successfully!');
        console.log('Character creation successful:', data.character);
        window.location.reload(); // Reload the page after successful submission
      } else {
        console.error('Character creation failed:', data);
        alert(`Failed to create character: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating character:', error);
      alert('An error occurred while creating the character.');
    }
  };

  const handleBack = () => {
    console.log('Navigating back to the previous page');
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Character</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Race:</label>
        <input
          type="text"
          name="race"
          value={formData.race}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Class:</label>
        <input
          type="text"
          name="character_class"
          value={formData.character_class}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Level:</label>
        <input
          type="number"
          name="level"
          value={formData.level}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      <div>
        <label>Background:</label>
        <input
          type="text"
          name="background"
          value={formData.background}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Alignment:</label>
        <input
          type="text"
          name="alignment"
          value={formData.alignment}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Strength:</label>
        <input
          type="number"
          name="strength"
          value={formData.strength}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Dexterity:</label>
        <input
          type="number"
          name="dexterity"
          value={formData.dexterity}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Constitution:</label>
        <input
          type="number"
          name="constitution"
          value={formData.constitution}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Intelligence:</label>
        <input
          type="number"
          name="intelligence"
          value={formData.intelligence}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Wisdom:</label>
        <input
          type="number"
          name="wisdom"
          value={formData.wisdom}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Charisma:</label>
        <input
          type="number"
          name="charisma"
          value={formData.charisma}
          onChange={handleChange}
          min="1"
        />
      </div>
      <button type="submit">Create Character</button>
      <button type="button" onClick={handleBack}>Back</button>
    </form>
  );
};

export default CreateCharacter;
