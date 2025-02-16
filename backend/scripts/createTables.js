async function createTables(pool) {
  try {
    await pool.query("BEGIN");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        iin VARCHAR(12) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        patronymic VARCHAR(50),
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        date_of_birth DATE NOT NULL,
        region VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS elections (
        election_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        region VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        candidate_id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        election_id INT REFERENCES elections(election_id) ON DELETE CASCADE,
        bio TEXT,
        avatar_url TEXT,
        additional_url_1 TEXT,
        additional_url_2 TEXT,
        party VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile_change_requests (
        request_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        field_name VARCHAR(100) NOT NULL,
        old_value TEXT NOT NULL,
        new_value TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_events (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        event_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS is_voted (
        PRIMARY KEY (user_id, election_id),
        user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        election_id INT NOT NULL REFERENCES elections(election_id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS voters (
        vote_id SERIAL PRIMARY KEY,
        candidate_id INT NOT NULL REFERENCES candidates(candidate_id) ON DELETE CASCADE,
        election_id INT NOT NULL REFERENCES elections(election_id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query("COMMIT");
    console.log("Tables created successfully.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error creating tables:", err);
  }
}

module.exports = createTables;
