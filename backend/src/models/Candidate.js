const pool = require("../config/db");

class Candidate {
  static async create(data) {
    const query =
      "INSERT INTO candidates (user_id, election_id, bio, party, additional_url_1, additional_url_2) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
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
    return result.rows[0];
  }

  static async attachToElection(candidateId, electionId) {
    const query =
      "UPDATE candidates SET election_id = $1 WHERE candidate_id = $2 RETURNING *";
    const values = [electionId, candidateId];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM candidates";

    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = "SELECT * FROM candidates WHERE candidate_id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM candidates WHERE candidate_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE candidates SET ${set} WHERE candidate_id = $${
      keys.length + 1
    } RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
}

module.exports = Candidate;
