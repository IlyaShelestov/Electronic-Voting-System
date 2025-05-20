const pool = require("../config/db");
const redisClient = require("../config/redis");

class Event {
  static async create(data) {
    const query =
      "INSERT INTO system_events (title, description, event_date) VALUES ($1, $2, $3) RETURNING *, to_char(event_date, 'YYYY-MM-DD') as event_date";
    const values = [data.title, data.description, data.event_date];

    const result = await pool.query(query, values);
    const event = result.rows[0];

    await redisClient.del("events:all");
    return event;
  }

  static async getAll() {
    const cacheKey = "events:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query =
      "SELECT *, to_char(event_date, 'YYYY-MM-DD') as event_date FROM system_events";
    const result = await pool.query(query);
    const events = result.rows;

    await redisClient.set(cacheKey, JSON.stringify(events), { EX: 86400 });
    return events;
  }

  static async getById(id) {
    const cacheKey = `events:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const query =
      "SELECT *, to_char(event_date, 'YYYY-MM-DD') as event_date FROM system_events WHERE event_id = $1";
    const result = await pool.query(query, [id]);
    const event = result.rows[0];

    if (event) {
      await redisClient.set(cacheKey, JSON.stringify(event), { EX: 86400 });
    }
    return event;
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM system_events WHERE event_id = $1 RETURNING *, to_char(event_date, 'YYYY-MM-DD') as event_date",
      [id]
    );
    const deleted = result.rows[0];

    await redisClient.del("events:all");
    await redisClient.del(`events:id:${id}`);
    return deleted;
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE system_events SET ${set} WHERE event_id = $${
      keys.length + 1
    } RETURNING *, to_char(event_date, 'YYYY-MM-DD') as event_date`;

    const result = await pool.query(query, [...values, id]);
    const updated = result.rows[0];

    await redisClient.del("events:all");
    await redisClient.del(`events:id:${id}`);
    return updated;
  }
}

module.exports = Event;
