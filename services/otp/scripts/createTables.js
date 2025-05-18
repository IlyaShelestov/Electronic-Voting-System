async function createTables(pool) {
  try {
    await pool.query("BEGIN");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        attempts INT DEFAULT 0
      );
    `);
    await pool.query("COMMIT");
    console.log("Tables created successfully.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error creating tables:", err);
  }
}

module.exports = createTables;
