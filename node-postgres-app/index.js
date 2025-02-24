// filepath: /path/to/node-postgres-app/index.js
const express = require('express');
const client = require('./db');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Node.js is running!');
});

app.get('/api/db-test', async (req, res) => {
    try {
        const result = await client.query('SELECT 1');
        res.json({ message: 'Database connection successful!', result: result.rows });
    } catch (err) {
        res.status(500).json({ message: `Database connection failed: ${err.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});