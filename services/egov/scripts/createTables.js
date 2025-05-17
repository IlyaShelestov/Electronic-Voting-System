async function createTables(pool) {
  try {
    await pool.query("BEGIN");
    await pool.query(`
            CREATE TABLE IF NOT EXISTS citizens (
                citizen_id SERIAL PRIMARY KEY,
                iin VARCHAR(12) UNIQUE NOT NULL,
                phone_number VARCHAR(20) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
