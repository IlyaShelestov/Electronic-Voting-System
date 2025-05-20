const pool = require("../config/db");
const redisClient = require("../config/redis");

class User {
  static async create(data) {
    const query =
      "INSERT INTO users (iin, first_name, last_name, patronymic, date_of_birth, city_id, phone_number, email, password_hash, role) VALUES ($1, $2, $3, $4, $5::date, $6, $7, $8, $9, $10) RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth";
    const values = [
      data.iin,
      data.first_name,
      data.last_name,
      data.patronymic || null,
      data.date_of_birth,
      data.city_id,
      data.phone_number,
      data.email,
      data.password_hash,
      data.role,
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    await redisClient.del("users:all");
    await redisClient.del(`users:iin:${user.iin}`);
    await redisClient.del(`users:phone:${user.phone_number}`);
    await redisClient.del(`users:email:${user.email}`);

    return user;
  }

  static async findByIIN(iin) {
    const cacheKey = `users:iin:${iin}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE iin = $1",
      [iin]
    );
    const user = result.rows[0];
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: 86400 });
    }
    return user;
  }

  static async getPasswordHash(iin) {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE iin = $1",
      [iin]
    );
    return result.rows[0];
  }

  static async findByPhoneNumber(phone_number) {
    const cacheKey = `users:phone:${phone_number}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE phone_number = $1",
      [phone_number]
    );
    const user = result.rows[0];
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: 86400 });
    }
    return user;
  }

  static async findById(id) {
    const cacheKey = `users:id:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE user_id = $1",
      [id]
    );
    const user = result.rows[0];
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: 86400 });
    }
    return user;
  }

  static async findByEmail(email) {
    const cacheKey = `users:email:${email}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (user) {
      await redisClient.set(cacheKey, JSON.stringify(user), { EX: 86400 });
    }
    return user;
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth",
      [id]
    );
    const deleted = result.rows[0];

    if (deleted) {
      await redisClient.del("users:all");
      await redisClient.del(`users:id:${id}`);
      await redisClient.del(`users:iin:${deleted.iin}`);
      await redisClient.del(`users:phone:${deleted.phone_number}`);
      await redisClient.del(`users:email:${deleted.email}`);
    }
    return deleted;
  }

  static async getAll() {
    const cacheKey = "users:all";
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await pool.query(
      "SELECT user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, to_char(date_of_birth, 'YYYY-MM-DD') as date_of_birth FROM users"
    );
    const users = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(users), { EX: 86400 });
    return users;
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    const query = `UPDATE users SET ${set} WHERE user_id = $${
      keys.length + 1
    } RETURNING user_id, iin, first_name, last_name, patronymic, city_id, phone_number, email, role, created_at, updated_at, date_of_birth::text as date_of_birth`;
    const result = await pool.query(query, [...values, id]);
    const updated = result.rows[0];

    if (updated) {
      await redisClient.del("users:all");
      await redisClient.del(`users:id:${id}`);
      await redisClient.del(`users:iin:${updated.iin}`);
      await redisClient.del(`users:phone:${updated.phone_number}`);
      await redisClient.del(`users:email:${updated.email}`);
    }
    return updated;
  }
}

module.exports = User;
