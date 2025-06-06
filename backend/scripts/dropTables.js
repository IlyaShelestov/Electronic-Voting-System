async function dropTables(pool) {
  try {
    await pool.query("BEGIN");

    await pool.query(`DROP TABLE IF EXISTS voters;`);
    await pool.query(`DROP TABLE IF EXISTS is_voted;`);
    await pool.query(`DROP TABLE IF EXISTS profile_change_requests;`);
    await pool.query(`DROP TABLE IF EXISTS system_events;`);
    await pool.query(`DROP TABLE IF EXISTS candidates;`);
    await pool.query(`DROP TABLE IF EXISTS elections;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);
    await pool.query(`DROP TABLE IF EXISTS cities;`);
    await pool.query(`DROP TABLE IF EXISTS regions;`);

    await pool.query("COMMIT");
    console.log("Tables deleted successfully.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error deleting tables:", err);
  }
}

module.exports = dropTables;
