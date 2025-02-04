const pool = require("../config/db");

class User {
  static async createUser(
    iin,
    name,
    surname,
    patronymic,
    date_of_birth,
    region,
    city,
    phone,
    email,
    password_hash,
    role = "user"
  ) {
    const query =
      "INSERT INTO users (iin, name, surname, patronymic, date_of_birth, region, city, phone, email, password_hash, role) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10, $11) RETURNING *, date_of_birth::text as date_of_birth";
    const values = [
      iin,
      name,
      surname,
      patronymic,
      date_of_birth,
      region,
      city,
      phone,
      email,
      password_hash,
      role,
    ];
    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async findByIIN(iin) {
    const result = await pool.query("SELECT * FROM users WHERE iin = $1", [
      iin,
    ]);
    return result.rows[0];
  }
}

module.exports = User;
