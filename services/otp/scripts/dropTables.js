async function dropTables(pool) {
  try {
    await pool.query("BEGIN");

    await pool.query("DROP TABLE IF EXISTS otps CASCADE;");

    await pool.query("COMMIT");
    console.log("Tables dropped successfully.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error dropping tables:", err);
  }
}

module.exports = dropTables;
