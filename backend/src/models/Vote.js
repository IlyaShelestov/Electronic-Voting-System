const pool = require("../config/db");

class Vote {
  static async checkVoted(data) {
    const query =
      "SELECT * FROM is_voted WHERE election_id = $1 AND user_id = $2";
    const values = [data.electionId, data.userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async checkCanVoteLocation({ electionId, userRegion, userCity }) {
    const query = `
      SELECT * FROM elections 
      WHERE election_id = $1 
      AND (region = $2 OR city = $3)
    `;
    const values = [electionId, userRegion, userCity];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async checkVoteToken(token) {
    const query = "SELECT * FROM voters WHERE token = $1";
    const values = [token];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async cast(data) {
    try {
      await pool.query("BEGIN");

      const voteQuery =
        "INSERT INTO voters (election_id, candidate_id, token) VALUES ($1, $2, $3) RETURNING *";
      const voteValues = [data.electionId, data.candidateId, data.token];
      const voteResult = await pool.query(voteQuery, voteValues);

      const isVotedQuery =
        "INSERT INTO is_voted (user_id, election_id) VALUES ($1, $2)";
      const isVotedValues = [data.userId, data.electionId];
      await pool.query(isVotedQuery, isVotedValues);

      await pool.query("COMMIT");
      return voteResult.rows[0];
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }
  }
}

module.exports = Vote;
