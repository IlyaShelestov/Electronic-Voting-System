const pool = require("../config/db");

class Event {
  static async create(data) {
    const query =
      "INSERT INTO events (title, description, event_date) VALUES ($1, $2, $3) RETURNING *";
    const values = [data.title, data.description, data.event_date];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM events";

    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = "SELECT * FROM system_events WHERE event_id = $1";
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM system_events WHERE event_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE system_events SET ${set} WHERE event_id = $${
      keys.length + 1
    } RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
}

module.exports = Event;
