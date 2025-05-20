const pool = require("../config/db");
const redisClient = require("../config/redis");

class City {
  static async create(data) {
    const query =
      "INSERT INTO cities (name, region_id) VALUES ($1, $2) RETURNING *";
    const values = [data.name, data.region_id];

    const result = await pool.query(query, values);
    const city = result.rows[0];

    await redisClient.del("cities:all");
    return city;
  }

  static async getAll() {
    const cacheKey = "cities:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM cities";
    const result = await pool.query(query);
    const cities = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(cities), { EX: 86400 });
    return cities;
  }

  static async getByName(name) {
    const cacheKey = `cities:name:${name}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM cities WHERE name = $1";
    const values = [name];
    const result = await pool.query(query, values);
    const row = result.rows[0];

    if (row) {
      await redisClient.set(cacheKey, JSON.stringify(row), { EX: 86400 });
    }
    return row;
  }

  static async getById(id) {
    const cacheKey = `cities:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM cities WHERE city_id = $1";
    const values = [id];
    const result = await pool.query(query, values);
    const row = result.rows[0];

    if (row) {
      await redisClient.set(cacheKey, JSON.stringify(row), { EX: 86400 });
    }
    return row;
  }
}

module.exports = City;
