const pool = require("../config/db");
const redisClient = require("../config/redis");

class Region {
  static async create(data) {
    const query = "INSERT INTO regions (name) VALUES ($1) RETURNING *";
    const values = [data.name];

    const result = await pool.query(query, values);
    const region = result.rows[0];

    await redisClient.del("regions:all");
    return region;
  }

  static async getAll() {
    const cacheKey = "regions:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM regions";
    const result = await pool.query(query);
    const regions = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(regions), { EX: 86400 });
    return regions;
  }

  static async getByName(name) {
    const cacheKey = `regions:name:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM regions WHERE name = $1";
    const values = [name];
    const result = await pool.query(query, values);
    const row = result.rows[0];

    if (row) {
      await redisClient.set(cacheKey, JSON.stringify(row), { EX: 86400 });
    }
    return row;
  }

  static async getById(id) {
    const cacheKey = `regions:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM regions WHERE region_id = $1";
    const values = [id];
    const result = await pool.query(query, values);
    const row = result.rows[0];

    if (row) {
      await redisClient.set(cacheKey, JSON.stringify(row), { EX: 86400 });
    }
    return row;
  }
}

module.exports = Region;
