const pool = require("../config/db");
const { formatLocalDate } = require("../utils/dateHelper");
const redisClient = require("../config/redis");

class Election {
  static async create(data) {
    const query =
      "INSERT INTO elections (title, start_date, end_date, region_id, city_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.title,
      data.start_date,
      data.end_date,
      data.region_id,
      data.city_id,
    ];

    const result = await pool.query(query, values);
    const election = result.rows[0];

    if (election.start_date) {
      election.start_date = formatLocalDate(election.start_date);
    }
    if (election.end_date) {
      election.end_date = formatLocalDate(election.end_date);
    }

    await redisClient.del("elections:all");
    return election;
  }

  static async getAll() {
    const cacheKey = "elections:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM elections";
    const result = await pool.query(query);
    const elections = result.rows.map((row) => {
      if (row.start_date) row.start_date = formatLocalDate(row.start_date);
      if (row.end_date) row.end_date = formatLocalDate(row.end_date);
      return row;
    });

    await redisClient.set(cacheKey, JSON.stringify(elections), { EX: 86400 });
    return elections;
  }

  static async getById(id) {
    const cacheKey = `elections:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query = "SELECT * FROM elections WHERE election_id = $1";
    const result = await pool.query(query, [id]);
    const election = result.rows[0];
    if (election) {
      if (election.start_date)
        election.start_date = formatLocalDate(election.start_date);
      if (election.end_date)
        election.end_date = formatLocalDate(election.end_date);
      await redisClient.set(cacheKey, JSON.stringify(election), { EX: 86400 });
    }
    return election;
  }

  static async getCandidates(electionId) {
    const cacheKey = `elections:${electionId}:candidates`;
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
        c.created_at   AS candidate_created_at,
        c.updated_at   AS candidate_updated_at,
        u.first_name,
        u.last_name,
        u.patronymic,
        u.city_id,
        u.phone_number,
        u.email,
        u.role,
        u.created_at   AS user_created_at,
        u.updated_at   AS user_updated_at
      FROM candidates c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.election_id = $1;
    `;
    const result = await pool.query(query, [electionId]);
    const rows = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 86400 });
    return rows;
  }

  static async getDailyVotes(electionId) {
    const cacheKey = `elections:${electionId}:dailyVotes`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

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
    const rows = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 86400 });
    return rows;
  }

  static async getAvailable(data) {
    const { region, city, date } = data;
    const cacheKey = `elections:available:${region}:${city}:${date}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query =
      "SELECT * FROM elections WHERE (region_id = $1 OR city_id = $2) AND start_date <= $3 AND end_date >= $3";
    const result = await pool.query(query, [region, city, date]);
    const rows = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(rows), { EX: 60 });
    return rows;
  }

  static async delete(id) {
    const query = "DELETE FROM elections WHERE election_id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    const deleted = result.rows[0];

    await redisClient.del("elections:all");
    await redisClient.del(`elections:id:${id}`);
    await redisClient.del(`elections:${id}:candidates`);
    await redisClient.del(`elections:${id}:dailyVotes`);
    return deleted;
  }
}

module.exports = Election;
