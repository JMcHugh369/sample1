const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // PostgreSQL connection
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
const PORT = 5002;

app.use(cors());
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

app.get('/campaigns/:campaignId/players', async (req, res) => {
    const { campaignId } = req.params;
    try {
        const result = await pool.query(
            'SELECT player_ids FROM campaigns WHERE id = $1',
            [campaignId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        res.json({ player_ids: result.rows[0].player_ids });
    } catch (err) {
        console.error("Error fetching player IDs:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Public messages
app.get('/chat/messages/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const result = await pool.query(
    'SELECT * FROM chat_messages WHERE campaign_id = $1 ORDER BY timestamp ASC',
    [campaignId]
  );
  res.json({ messages: result.rows });
});

// Private messages
app.get('/chat/private/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const result = await pool.query(
    `SELECT * FROM chat_messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY timestamp ASC`,
    [user1, user2]
  );
  res.json({ messages: result.rows });
});

// Example: Add to your backend server.js
app.get('/dm/me', async (req, res) => {
  const campaignId = req.query.campaignId;
  if (!campaignId || isNaN(Number(campaignId))) {
    return res.status(400).json({ error: "Valid campaignId is required" });
  }
  try {
    // Look up the DM for the given campaign
    const result = await pool.query(
      `SELECT dm_id, username FROM campaigns 
       JOIN users ON campaigns.dm_id = users.id 
       WHERE campaigns.id = $1 LIMIT 1`,
      [campaignId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign or DM not found" });
    }

    const dm = result.rows[0];
    res.json({
      id: dm.dm_id,
      username: dm.username,
      campaign_id: campaignId
    });
  } catch (err) {
    console.error("Error in /dm/me:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/characters/:characterId', async (req, res) => {
    const { characterId } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                c.id,
                c.name,
                c.level,
                c.species,
                c.character_class,
                c.background,
                c.platinum_coins,
                c.gold_coins,
                c.electrum,
                c.silver_coins,
                c.copper_coins,
                c.user_id,         -- Make sure this is included!
                u.username,
                -- add any other fields you need
                c.alignment,
                c.armor_class,
                c.charisma_mod,
                c.charisma,
                c.constitution_mod,
                c.constitution,
                c.dexterity_mod,
                c.dexterity,
                c.electrum,
                c.gold_coins,
                c.hit_points,
                c.image_url,
                c.initiative,
                c.intelligence_mod,
                c.intelligence,
                c.no_hit_dice,
                c.passive_perception,
                c.per_level,
                c.proficiency_bonus,
                c.silver_coins,
                c.size,
                c.speed,
                c.strength_mod,
                c.strength,
                c.wisdom_mod,
                c.wisdom
             FROM characters c
             LEFT JOIN users u ON c.user_id = u.id
             WHERE c.id = $1`,
            [characterId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Character not found" });
        }
        res.json({ character: result.rows[0] });
    } catch (err) {
        console.error("Error fetching character:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/campaigns/:campaignId/users', async (req, res) => {
    const { campaignId } = req.params;
    try {
        // Get player_ids and dm_id from the campaign
        const campaignResult = await pool.query(
            'SELECT player_ids, dm_id FROM campaigns WHERE id = $1',
            [campaignId]
        );
        if (campaignResult.rows.length === 0) {
            return res.status(404).json({ error: "Campaign not found" });
        }
        const { player_ids, dm_id } = campaignResult.rows[0];

        // Combine player_ids and dm_id, remove duplicates
        const allUserIds = Array.from(new Set([...(player_ids || []), dm_id]));

        if (allUserIds.length === 0) {
            return res.json({ users: [] });
        }

        // Fetch user info for all relevant users
        const usersResult = await pool.query(
            `SELECT id, username FROM users WHERE id = ANY($1)`,
            [allUserIds]
        );

        res.json({ users: usersResult.rows });
    } catch (err) {
        console.error("Error fetching users for campaign:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get DM notes for a campaign
app.get('/campaigns/:campaignId/dm-notes', async (req, res) => {
    const { campaignId } = req.params;
    const result = await pool.query(
        'SELECT * FROM notes WHERE campaign_id = $1 AND is_dm_note = true AND is_public = true ORDER BY created_at ASC',
        [campaignId]
    );
    res.json({ notes: result.rows });
});

// Post a DM note (only DM should be allowed to call this)
app.post('/campaigns/:campaignId/dm-notes', async (req, res) => {
    const { campaignId } = req.params;
    const { user_id, content } = req.body;

    // Check if user_id is the DM for this campaign
    const dmResult = await pool.query(
        'SELECT dm_id FROM campaigns WHERE id = $1',
        [campaignId]
    );
    if (dmResult.rows.length === 0 || dmResult.rows[0].dm_id !== user_id) {
        return res.status(403).json({ error: "Only the DM can add DM notes." });
    }

    const result = await pool.query(
        'INSERT INTO notes (campaign_id, user_id, is_dm_note, is_public, content) VALUES ($1, $2, true, true, $3) RETURNING *',
        [campaignId, user_id, content]
    );
    const note = result.rows[0];

    // Emit to all users in the campaign room
    io.to(`campaign_${campaignId}`).emit('dm_note_added', note);

    res.json({ note });
});

// Get private notes for a user in a campaign
app.get('/campaigns/:campaignId/private-notes/:userId', async (req, res) => {
    const { campaignId, userId } = req.params;
    const result = await pool.query(
        'SELECT * FROM notes WHERE campaign_id = $1 AND user_id = $2 AND is_dm_note = false AND is_public = false ORDER BY created_at ASC',
        [campaignId, userId]
    );
    res.json({ notes: result.rows });
});

// Post a private note
app.post('/campaigns/:campaignId/private-notes/:userId', async (req, res) => {
    const { campaignId, userId } = req.params;
    const { content } = req.body;
    const result = await pool.query(
        'INSERT INTO notes (campaign_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
        [campaignId, userId, content]
    );
    res.json({ note: result.rows[0] });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_campaign', (campaign_id) => {
    socket.join(`campaign_${campaign_id}`);
  });

  socket.on('public_message', async (msg) => {
    // Save to PostgreSQL
    await pool.query(
      'INSERT INTO chat_messages (campaign_id, sender_id, sender_username, content, timestamp) VALUES ($1, $2, $3, $4, NOW())',
      [msg.campaign_id, msg.sender_id, msg.sender_username, msg.content]
    );
    io.to(`campaign_${msg.campaign_id}`).emit('public_message', msg);
  });

  socket.on('private_message', async (msg) => {
    await pool.query(
      'INSERT INTO chat_messages (sender_id, receiver_id, sender_username, content, timestamp) VALUES ($1, $2, $3, $4, NOW())',
      [msg.sender_id, msg.receiver_id, msg.sender_username, msg.content]
    );
    io.to(msg.sender_id).emit('private_message', msg);
    io.to(msg.receiver_id).emit('private_message', msg);
  });

  socket.on('join_private', (user_id) => {
    socket.join(user_id);
  });
});

// Start both HTTP and Socket.IO server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
