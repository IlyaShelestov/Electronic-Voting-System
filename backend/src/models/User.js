const pool = require("../config/db");

class User {
  static async createUser(
    iin,
    name,
    surname,
    patronymic,
    birth_date,
    region,
    city,
    phone,
    password,
    role = "user"
  ) {
    const query =
      "INSERT INTO users (iin, name, surname, patronymic, birth_date, region, city, phone, password, role) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10) RETURNING *, birth_date::text as birth_date";
    const values = [
      iin,
      name,
      surname,
      patronymic,
      birth_date,
      region,
      city,
      phone,
      password,
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
