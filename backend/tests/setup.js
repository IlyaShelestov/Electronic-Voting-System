require("../src/config/environment");
const pool = require("../src/config/db");
const redisClient = require("../src/config/redis");

truncateAllTables = async () => {
  const tables = [
    "regions",
    "cities",
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
  await redisClient.flushDb();
});

afterEach(async () => {
  await truncateAllTables();
  await redisClient.flushDb();
});

afterAll(async () => {
  await pool.end();
  await redisClient.flushDb();
  await redisClient.quit();
});
