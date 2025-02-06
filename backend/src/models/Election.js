const pool = require("../config/db");

class Election {
  static async create(data) {
    const query =
      "INSERT INTO elections (title, start_date, end_date, region, city) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.title,
      data.start_date,
      data.end_date,
      data.region,
      data.city,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM elections";

    const result = await pool.query(query);
    return result;
  }

  static async getById(id) {
    const query = "SELECT * FROM elections WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAvailable(data) {
    const query =
      "SELECT * FROM elections WHERE (region = $1 OR city = $2) AND start_date <= $3 AND end_date >= $3";
    const values = [data.region, data.city, data.date];

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async delete(id) {
    const query = "DELETE FROM elections WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result;
  }
}

module.exports = Election;
