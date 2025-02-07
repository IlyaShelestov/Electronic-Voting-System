const pool = require("../config/db");

class Election {
  static async create(data) {
    const query =
      "INSERT INTO elections (title, start_date, end_date, region, city) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.title,
      data.start_date,
      data.end_date,
      data.region,
      data.city,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM elections";

    const result = await pool.query(query);
    return result;
  }

  static async getById(id) {
    const query = "SELECT * FROM elections WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getCandidates(electionId) {
    const query = "SELECT * FROM candidates WHERE election_id = $1";
    const values = [electionId];

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getDailyVotes(electionId) {
    const query = `
      SELECT 
        c.candidate_id,
        c.user_id,
        c.bio,
        c.party,
        DATE(v.voted_at) AS voted_day,
        COUNT(v.vote_id) AS vote_count
      FROM candidates c
      LEFT JOIN voters v ON v.candidate_id = c.candidate_id
      WHERE c.election_id = $1
      GROUP BY c.candidate_id, c.user_id, c.bio, c.party, DATE(v.voted_at)
      ORDER BY voted_day;
    `;
    const result = await pool.query(query, [electionId]);
    return result.rows;
  }

  static async getAvailable(data) {
    const query =
      "SELECT * FROM elections WHERE (region = $1 OR city = $2) AND start_date <= $3 AND end_date >= $3";
    const values = [data.region, data.city, data.date];

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async delete(id) {
    const query = "DELETE FROM elections WHERE id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result;
  }
}

module.exports = Election;
