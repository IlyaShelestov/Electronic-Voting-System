const pool = require("../config/db");

class City {
  static async create(data) {
    const query =
      "INSERT INTO cities (name, region_id) VALUES ($1, $2) RETURNING *";
    const values = [data.name, data.region_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM cities";

    const result = await pool.query(query);
    return result.rows;
  }

  static async getByName(name) {
    const query = "SELECT * FROM cities WHERE name = $1";
    const values = [name];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getById(id) {
    const query = "SELECT * FROM cities WHERE city_id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = City;
