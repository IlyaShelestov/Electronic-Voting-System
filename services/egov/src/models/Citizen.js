const pool = require("../config/db");

class Citizen {
  static async getAll() {
    const query = "SELECT * FROM citizens";
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByIIN(iin) {
    const query = "SELECT * FROM citizens WHERE iin = $1";

    const values = [iin];

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Citizen;
