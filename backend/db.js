const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your database host
  database: 'dnd_game_db', // Replace with your database name
  password: 'password', // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port
});

module.exports = pool;