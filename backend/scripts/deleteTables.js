const pool = require("../src/config/db");

async function deleteTables() {
  try {
    await pool.query(` DROP TABLE IF EXISTS users; `);
    console.log("Tables deleted successfully.");
  } catch (err) {
    console.error("Error deleting tables:", err);
  } finally {
    pool.end();
  }
}

deleteTables();