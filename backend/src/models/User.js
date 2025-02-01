const pool = require("../config/db");

class User {
  static async createUser(
    iin,
    name,
    surname,
    patronymic,
    nationality,
    birth_date,
    region,
    city,
    address,
    sex,
    email,
    phone,
    password,
    role
  ) {
    const query =
      "INSERT INTO users (iin, name, surname, patronymic, nationality, birth_date, region, city, address, sex, email, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";
    const values = [
      iin,
      name,
      surname,
      patronymic,
      nationality,
      birth_date,
      region,
      city,
      address,
      sex,
      email,
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
