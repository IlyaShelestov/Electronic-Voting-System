const pool = require("../config/db");
const redisClient = require("../config/redis");

class Candidate {
  static async create(data) {
    const query =
      "INSERT INTO candidates (user_id, election_id, bio, party, avatar_url, additional_url_1, additional_url_2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const values = [
      data.user_id,
      data.election_id || null,
      data.bio,
      data.party,
      data.avatar_url || null,
      data.additional_url_1 || null,
      data.additional_url_2 || null,
    ];

    const result = await pool.query(query, values);
    const candidate = result.rows[0];

    await redisClient.del("candidates:all");
    return candidate;
  }

  static async attachToElection(candidateId, electionId) {
    const query =
      "UPDATE candidates SET election_id = $1 WHERE candidate_id = $2 RETURNING *";
    const values = [electionId, candidateId];

    const result = await pool.query(query, values);
    const updated = result.rows[0];

    await redisClient.del("candidates:all");
    await redisClient.del(`candidates:id:${candidateId}`);
    return updated;
  }

  static async getAll() {
    const cacheKey = "candidates:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = `
      SELECT
        c.candidate_id,
        c.user_id,
        c.election_id,
        c.bio,
        c.party,
        c.avatar_url,
        c.additional_url_1,
        c.additional_url_2,
        c.created_at   AS created_at,
        c.updated_at   AS updated_at,
        u.first_name,
        u.last_name,
        u.patronymic,
        u.city_id,
        u.phone_number,
        u.email,
        u.role
      FROM candidates c
      JOIN users u ON c.user_id = u.user_id;
    `;
    const result = await pool.query(query);
    const candidates = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(candidates), { EX: 86400 });
    return candidates;
  }

  static async getById(id) {
    const cacheKey = `candidates:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = `
      SELECT
        c.candidate_id,
        c.user_id,
        c.election_id,
        c.bio,
        c.party,
        c.avatar_url,
        c.additional_url_1,
        c.additional_url_2,
        c.created_at   AS created_at,
        c.updated_at   AS updated_at,
        u.first_name,
        u.last_name,
        u.patronymic,
        u.city_id,
        u.phone_number,
        u.email,
        u.role
      FROM candidates c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.candidate_id = $1;
    `;
    const result = await pool.query(query, [id]);
    const candidate = result.rows[0];

    if (candidate) {
      await redisClient.set(cacheKey, JSON.stringify(candidate), { EX: 86400 });
    }
    return candidate;
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM candidates WHERE candidate_id = $1 RETURNING *",
      [id]
    );
    const deleted = result.rows[0];

    await redisClient.del("candidates:all");
    await redisClient.del(`candidates:id:${id}`);
    return deleted;
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE candidates SET ${set} WHERE candidate_id = $${
      keys.length + 1
    } RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    const updated = result.rows[0];

    await redisClient.del("candidates:all");
    await redisClient.del(`candidates:id:${id}`);
    return updated;
  }
}

module.exports = Candidate;
