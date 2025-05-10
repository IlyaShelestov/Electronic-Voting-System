const pool = require("../config/db");

class ProfileChangeRequest {
  static async create(data) {
    const query =
      "INSERT INTO profile_change_requests (user_id, field_name, old_value, new_value, status) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.user_id,
      data.field_name,
      data.old_value,
      data.new_value,
      "pending",
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = `
        SELECT pcr.*, u.first_name, u.last_name, u.iin
        FROM profile_change_requests pcr
        JOIN users u ON pcr.user_id = u.user_id
        ORDER BY pcr.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `
        SELECT pcr.*, u.first_name, u.last_name, u.iin
        FROM profile_change_requests pcr
        JOIN users u ON pcr.user_id = u.user_id
        WHERE pcr.request_id = $1
    `;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const query =
      "SELECT * FROM profile_change_requests WHERE user_id = $1 ORDER BY created_at DESC";
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query =
      "UPDATE profile_change_requests SET status = $1 WHERE request_id = $2 RETURNING *";
    const values = [status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = ProfileChangeRequest;
