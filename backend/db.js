const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'dnd_game_db', // Replace with your PostgreSQL database name
  password: 'Avengers#1', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port
});

module.exports = pool;