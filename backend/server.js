const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = 5001; // Ensure this matches the frontend fetch URL

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from the frontend
app.use(bodyParser.json());

// Route to add a new user
app.post('/add_user', async (req, res) => {
  const { username, email, password, discord } = req.body;
  console.log('Received signup request:', { username, email, password, discord }); // Debug log
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password, discord) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, discord]
    );
    console.log('User created:', result.rows[0]); // Debug log
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error during signup:', err); // Debug log
    if (err.code === '23505') { // Unique violation error code for PostgreSQL
      const field = err.constraint.split('_')[1]; // Extract the field name from the constraint
      res.status(400).json({ success: false, message: `${field} is already in use` });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

// Route to authenticate a user
app.post('/authenticate_user', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', username); // Debug log
  try {
    const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (user) {
      const match = password === user.password; // Directly compare the password with the stored password
      if (match) {
        res.json({ success: true, user_id: user.id }); // Include user_id in the response
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error querying the database:', err); // Debug log
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to add a new campaign
app.post('/add_campaign', async (req, res) => {
  console.log('Received campaign creation request:', req.body); // Debug log
  const { name, dm_username } = req.body;

  if (!name || !dm_username) {
    return res.status(400).json({ error: 'Missing required fields: name and dm_username are required' });
  }

  try {
    const dmResult = await pool.query('SELECT id FROM users WHERE username = $1', [dm_username]);
    if (dmResult.rows.length === 0) {
      return res.status(404).json({ error: `User with username '${dm_username}' not found` });
    }
    const dm_id = dmResult.rows[0].id;

    const accessCode = generateAccessCode();

    const result = await pool.query(
      'INSERT INTO campaigns (name, dm_id, access_code) VALUES ($1, $2, $3) RETURNING *',
      [name, dm_id, accessCode]
    );

    console.log('Campaign created successfully:', result.rows[0]); // Debug log
    res.status(201).json({ success: true, campaign: result.rows[0] });
  } catch (err) {
    console.error('Error saving campaign to database:', err); // Debug log
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to add a new character
app.post('/add_character', async (req, res) => {
  console.log('Received request to /add_character:', req.body); // Debug log
  const {
    name,
    race,
    character_class,
    level,
    background,
    alignment,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    armor_class,
    hit_points,
    speed,
    proficiency_bonus,
    skills,
    saving_throws,
    equipment,
    features,
    spells,
    languages,
    notes,
    copper_coins,
    silver_coins,
    gold_coins,
    platinum_coins,
    inventory,
    total_weight,
    username,
  } = req.body;

  try {
    // Retrieve user_id based on the username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: `User with username '${username}' not found` });
    }
    const user_id = userResult.rows[0].id;

    // Insert the character into the database
    const result = await pool.query(
      `INSERT INTO characters (
        user_id, name, race, character_class, level, background, alignment,
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        armor_class, hit_points, speed, proficiency_bonus,
        skills, saving_throws, equipment, features, spells, languages, notes,
        copper_coins, silver_coins, gold_coins, platinum_coins, inventory, total_weight
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28, $29, $30
      ) RETURNING *`,
      [
        user_id,
        name,
        race,
        character_class,
        level,
        background,
        alignment,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        armor_class,
        hit_points,
        speed,
        proficiency_bonus,
        skills,
        saving_throws,
        equipment,
        features,
        spells,
        languages,
        notes,
        copper_coins,
        silver_coins,
        gold_coins,
        platinum_coins,
        inventory,
        total_weight,
      ]
    );

    console.log('Character created successfully:', result.rows[0]); // Debug log
    res.status(201).json({ success: true, character: result.rows[0] });
  } catch (err) {
    console.error('Error saving character to database:', err); // Debug log
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to get characters
app.get('/get_characters', async (req, res) => {
  console.log('Received request to /get_characters:', req.query); // Debug log
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing required field: user_id' });
  }

  try {
    const result = await pool.query('SELECT * FROM characters WHERE user_id = $1', [user_id]);
    console.log('Characters retrieved:', result.rows); // Debug log
    res.status(200).json({ success: true, characters: result.rows });
  } catch (err) {
    console.error('Error retrieving characters:', err); // Debug log
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to delete a character
app.delete('/delete_character/:id', async (req, res) => {
  console.log('Received request to delete character:', req.params.id); // Debug log
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM characters WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }
    console.log('Character deleted:', result.rows[0]); // Debug log
    res.status(200).json({ success: true, message: 'Character deleted successfully' });
  } catch (err) {
    console.error('Error deleting character:', err); // Debug log
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Helper function to generate a random access code
function generateAccessCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let accessCode = '';
  for (let i = 0; i < length; i++) {
    accessCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return accessCode;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
