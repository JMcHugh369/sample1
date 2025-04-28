const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Save (or update) the selected map for a campaign
app.post('/campaigns/:campaignId/map', async (req, res) => {
  const { campaignId } = req.params;
  const { src, name } = req.body; // src is the base64 data URL
  try {
    await pool.query(
      'UPDATE campaigns SET selected_map = $1 WHERE id = $2',
      [src, campaignId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving map:", err);
    res.status(500).json({ error: "Failed to save map" });
  }
});

// Fetch the selected map for a campaign
app.get('/campaigns/:campaignId/map', async (req, res) => {
  const { campaignId } = req.params;
  try {
    const result = await pool.query(
      'SELECT selected_map FROM campaigns WHERE id = $1',
      [campaignId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json({ src: result.rows[0].selected_map });
  } catch (err) {
    console.error("Error fetching map:", err);
    res.status(500).json({ error: "Failed to fetch map" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});