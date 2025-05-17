async function dropTables(pool) {
  try {
    await pool.query("BEGIN");

    await pool.query("DROP TABLE IF EXISTS citizens;");

    await pool.query("COMMIT");
    console.log("Tables deleted successfully.");
  } catch (err) {
    pool.query("ROLLBACK");
    console.error("Error deleting tables:", err);
  }
}

module.exports = dropTables;
