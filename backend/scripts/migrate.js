require("../src/config/environment");
const pool = require("../src/config/db");
const createTables = require("./createTables");
const dropTables = require("./dropTables");

async function migrate() {
  try {
    await dropTables(pool);
    await createTables(pool);
    console.log("Migration successful.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
