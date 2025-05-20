const pool = require("../config/db");
const redisClient = require("../config/redis");

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
    const request = result.rows[0];

    await redisClient.del("profileChangeRequests:all");
    await redisClient.del(`profileChangeRequests:user:${data.user_id}`);

    return request;
  }

  static async getAll() {
    const cacheKey = "profileChangeRequests:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = `
      SELECT pcr.*, u.first_name, u.last_name, u.iin
      FROM profile_change_requests pcr
      JOIN users u ON pcr.user_id = u.user_id
      ORDER BY pcr.created_at DESC
    `;
    const result = await pool.query(query);
    const rows = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 86400 });
    return rows;
  }

  static async getById(id) {
    const cacheKey = `profileChangeRequests:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = `
      SELECT pcr.*, u.first_name, u.last_name, u.iin
      FROM profile_change_requests pcr
      JOIN users u ON pcr.user_id = u.user_id
      WHERE pcr.request_id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];

    if (row) {
      await redisClient.set(cacheKey, JSON.stringify(row), { EX: 86400 });
    }
    return row;
  }

  static async getByUserId(userId) {
    const cacheKey = `profileChangeRequests:user:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query =
      "SELECT * FROM profile_change_requests WHERE user_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [userId]);
    const rows = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 86400 });
    return rows;
  }

  static async updateStatus(id, status) {
    const query =
      "UPDATE profile_change_requests SET status = $1 WHERE request_id = $2 RETURNING *";
    const result = await pool.query(query, [status, id]);
    const updated = result.rows[0];

    if (updated) {
      await redisClient.del("profileChangeRequests:all");
      await redisClient.del(`profileChangeRequests:id:${id}`);
      await redisClient.del(`profileChangeRequests:user:${updated.user_id}`);
    }
    return updated;
  }
}

module.exports = ProfileChangeRequest;
