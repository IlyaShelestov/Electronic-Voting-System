const pool = require("../config/db");

class Region {
  static async create(data) {
    const query = "INSERT INTO regions (name) VALUES ($1) RETURNING *";
    const values = [data.name];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM regions";

    const result = await pool.query(query);
    return result.rows;
  }

  static async getByName(name) {
    const query = "SELECT * FROM regions WHERE name = $1";
    const values = [name];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getById(id) {
    const query = "SELECT * FROM regions WHERE region_id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Region;
