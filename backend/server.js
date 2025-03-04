const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const scrypt = require('scrypt-js');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const verifyPassword = async (password, hash) => {
  const [algorithm, params, salt, key] = hash.split('$');
  const [N, r, p] = params.split(':').map(Number);
  const saltBuffer = Buffer.from(salt, 'base64');
  const keyBuffer = Buffer.from(key, 'base64');
  const passwordBuffer = Buffer.from(password);

  return new Promise((resolve, reject) => {
    scrypt(passwordBuffer, saltBuffer, N, r, p, 64, (error, progress, derivedKey) => {
      if (error) {
        reject(error);
      } else if (derivedKey) {
        resolve(Buffer.compare(Buffer.from(derivedKey), keyBuffer) === 0);
      }
    });
  });
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', email); // Log the received request
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Query result:', result.rows); // Log the query result
    const user = result.rows[0];
    if (user) {
      const match = await verifyPassword(password, user.password_hash); // Use the correct field name
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