require("../src/config/environment");
const pool = require("../src/config/db");

truncateAllTables = async () => {
  const tables = [
    "users",
    "voters",
    "candidates",
    "elections",
    "is_voted",
    "profile_change_requests",
    "system_events",
  ];

  for (const table of tables) {
    await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
  }
};

beforeEach(async () => {
  await truncateAllTables();
});

afterEach(async () => {
  await truncateAllTables();
});

afterAll(async () => {
  await pool.end();
});
