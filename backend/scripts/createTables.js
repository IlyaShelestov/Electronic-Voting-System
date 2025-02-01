const pool = require("../src/config/db");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        iin VARCHAR(64) NOT NULL,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        patronymic VARCHAR(255),
        nationality VARCHAR(255),
        birth_date DATE,
        region VARCHAR(255),
        city VARCHAR(255),
        address VARCHAR(255),
        sex VARCHAR(64),
        email VARCHAR(255),
        phone VARCHAR(64),
        password VARCHAR(255),
        role VARCHAR(64)
      );
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
}

createTables();