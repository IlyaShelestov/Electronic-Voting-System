const pool = require("../config/db");

class User {
  static async create(data) {
    const query =
      "INSERT INTO users (iin, first_name, last_name, patronymic, date_of_birth, region, city, phone_number, email, password_hash, role) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10, $11) RETURNING *, date_of_birth::text as date_of_birth";
    const values = [
      data.iin,
      data.first_name,
      data.last_name,
      data.patronymic || null,
      data.date_of_birth,
      data.region,
      data.city,
      data.phone_number,
      data.email,
      data.password_hash,
      data.role,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByIIN(iin) {
    const result = await pool.query("SELECT * FROM users WHERE iin = $1", [
      iin,
    ]);
    return result.rows[0];
  }

  static async findbyId(id) {
    const result = await pool.query("SELECT * FROM users where user_id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async deleteUser(id) {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async updateUser(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE users SET ${set} WHERE user_id = $${
      keys.length + 1
    } RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
}

module.exports = User;
