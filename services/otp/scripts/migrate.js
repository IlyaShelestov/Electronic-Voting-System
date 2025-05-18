require("../src/config/environment");

const pool = require("../src/config/db");
const createTables = require("./createTables");
const dropTables = require("./dropTables");

async function migrate() {
  try {
    await dropTables(pool);
    await createTables(pool);
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Error during migration:", err);
  } finally {
    pool.end();
  }
}

migrate();
