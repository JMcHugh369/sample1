const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/add_user', async (req, res) => {
  const { username, email, password, discord } = req.body;
  console.log('Received account creation request:', { username, email, password, discord }); // Log the received request
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password, discord) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password, discord]
    );
    console.log('User created:', result.rows[0]); // Log the created user
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Error creating user:', err); // Log the error
    if (err.code === '23505') { // Unique violation error code for PostgreSQL
      const field = err.constraint.split('_')[1]; // Extract the field name from the constraint
      res.status(400).json({ success: false, message: `${field} is already in use` });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

app.post('/authenticate_user', async (req, res) => {
  const { username, password } = req.body; // Use username instead of email
  console.log('Received login request:', username); // Log the received request
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // Query by username
    console.log('Query result:', result.rows); // Log the query result
    const user = result.rows[0];
    if (user) {
      console.log('User found:', user); // Log user details
      console.log('Password:', password); // Log password
      console.log('Stored password:', user.password); // Log stored password
      const match = password === user.password; // Directly compare the password with the stored password
      if (match) {
        console.log('Password match'); // Log password match
        res.json({ success: true });
      } else {
        console.log('Invalid credentials'); // Log invalid credentials
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      console.log('User not found'); // Log user not found
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error querying the database:', err); // Log database error
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
