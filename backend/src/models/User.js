const pool = require("../config/db");

class User {
  static async create(data) {
    const query =
      "INSERT INTO users (iin, first_name, last_name, patronymic, date_of_birth, city_id, phone_number, email, password_hash, role) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10) RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth";
    const values = [
      data.iin,
      data.first_name,
      data.last_name,
      data.patronymic || null,
      data.date_of_birth,
      data.city_id,
      data.phone_number,
      data.email,
      data.password_hash,
      data.role,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByIIN(iin) {
    const result = await pool.query(
      "SELECT iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users users WHERE iin = $1",
      [iin]
    );
    return result.rows[0];
  }

  static async getPasswordHash(iin) {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE iin = $1",
      [iin]
    );
    return result.rows[0];
  }

  static async findByPhoneNumber(phone_number) {
    const result = await pool.query(
      "SELECT iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE phone_number = $1",
      [phone_number]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users where user_id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth",
      [id]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users"
    );
    return result.rows;
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE users SET ${set} WHERE user_id = $${
      keys.length + 1
    } RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
}

module.exports = User;
