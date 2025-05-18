const pool = require("../config/db");

class Otp {
  static async create(email, otp) {
    const query = `
      INSERT INTO otps (email, otp, created_at)
      VALUES ($1, $2, NOW())
      RETURNING *;
    `;
    const values = [email, otp];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = `
      SELECT * FROM otps
      WHERE email = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteByEmail(email) {
    const query = `
      DELETE FROM otps
      WHERE email = $1;
    `;
    const values = [email];
    await pool.query(query, values);
  }

  static async updateAttempts(email, attempts) {
    const query = `
      UPDATE otps
      SET attempts = $1
      WHERE email = $2;
    `;
    const values = [attempts, email];
    await pool.query(query, values);
  }
}

module.exports = Otp;
