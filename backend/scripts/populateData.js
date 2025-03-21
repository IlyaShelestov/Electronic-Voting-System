require("../src/config/environment");
const pool = require("../src/config/db");
const bcrypt = require("bcrypt");

async function populateData() {
  try {
    await pool.query("BEGIN");

    console.log("Hashing passwords...");
    const plainPasswords = {
      admin: "Admin123!",
      manager: "Manager123!",
      candidate1: "Alice123!",
      candidate2: "Bob123!",
      candidate3: "Charlie123!",
      user1: "User123!",
      user2: "User123!",
      user3: "User123!",
      user4: "User123!",
      user5: "User123!",
      user6: "User123!",
      user7: "User123!",
      user8: "User123!",
      user9: "User123!",
      user10: "User123!",
    };

    const hashedPasswords = {};
    for (const key in plainPasswords) {
      hashedPasswords[key] = await bcrypt.hash(plainPasswords[key], 10);
    }

    console.log("Inserting regions and cities...");
    const regionRes = await pool.query(
      "INSERT INTO regions (name) VALUES ('Астана') RETURNING region_id;"
    );
    const regionId = regionRes.rows[0].region_id;

    const cityRes = await pool.query(
      "INSERT INTO cities (name, region_id) VALUES ('Астана', $1) RETURNING city_id;",
      [regionId]
    );
    const cityId = cityRes.rows[0].city_id;

    console.log("Populating users...");
    const userRes = await pool.query(`
      INSERT INTO users (iin, first_name, last_name, patronymic, phone_number, email, date_of_birth, city_id, password_hash, role)
      VALUES 
      ('111111111111', 'Админ', 'Пользователь', NULL, '+77010000000', 'admin@example.com', '1980-01-01', ${cityId}, '${hashedPasswords.admin}', 'admin'),
      ('222222222222', 'Менеджер', 'Пользователь', NULL, '+77010000001', 'manager@example.com', '1985-01-01', ${cityId}, '${hashedPasswords.manager}', 'manager'),
      ('333333333333', 'Иван', 'Кандидат', NULL, '+77010000002', 'ivan@example.com', '1990-02-15', ${cityId}, '${hashedPasswords.candidate1}', 'user'),
      ('444444444444', 'Алексей', 'Кандидат', NULL, '+77010000003', 'alexey@example.com', '1985-03-20', ${cityId}, '${hashedPasswords.candidate2}', 'user'),
      ('555555555555', 'Мария', 'Кандидат', NULL, '+77010000004', 'maria@example.com', '1988-07-25', ${cityId}, '${hashedPasswords.candidate3}', 'user'),
      ('666666666666', 'Сергей', 'Пользователь', NULL, '+77010000005', 'sergey@example.com', '1992-05-10', ${cityId}, '${hashedPasswords.user1}', 'user'),
      ('777777777777', 'Николай', 'Пользователь', NULL, '+77010000006', 'nikolay@example.com', '1993-03-10', ${cityId}, '${hashedPasswords.user2}', 'user'),
      ('888888888888', 'Петр', 'Пользователь', NULL, '+77010000007', 'petr@example.com', '1994-02-11', ${cityId}, '${hashedPasswords.user3}', 'user'),
      ('999999999999', 'Дмитрий', 'Пользователь', NULL, '+77010000008', 'dmitry@example.com', '1995-01-12', ${cityId}, '${hashedPasswords.user4}', 'user'),
      ('121212121212', 'Андрей', 'Пользователь', NULL, '+77010000009', 'andrey@example.com', '1986-08-13', ${cityId}, '${hashedPasswords.user5}', 'user'),
      ('131313131313', 'Константин', 'Пользователь', NULL, '+77010000010', 'konstantin@example.com', '1987-07-14', ${cityId}, '${hashedPasswords.user6}', 'user'),
      ('141414141414', 'Ольга', 'Пользователь', NULL, '+77010000011', 'olga@example.com', '1982-02-15', ${cityId}, '${hashedPasswords.user7}', 'user'),
      ('151515151515', 'Екатерина', 'Пользователь', NULL, '+77010000012', 'ekaterina@example.com', '1983-01-16', ${cityId}, '${hashedPasswords.user8}', 'user'),
      ('161616161616', 'Василий', 'Пользователь', NULL, '+77010000013', 'vasiliy@example.com', '1984-03-17', ${cityId}, '${hashedPasswords.user9}', 'user'),
      ('171717171717', 'Татьяна', 'Пользователь', NULL, '+77010000014', 'tatiana@example.com', '1985-02-18', ${cityId}, '${hashedPasswords.user10}', 'user')
      RETURNING user_id;
    `);

    const userIds = userRes.rows.map((row) => row.user_id);
    const candidateUserIds = userIds.slice(2, 5);
    const voterIds = userIds.slice(5);

    console.log("Populating election...");
    const electionRes = await pool.query(`
      INSERT INTO elections (title, start_date, end_date, region_id, city_id)
      VALUES ('Presidential Election', '2025-03-01 08:00:00', '2025-03-01 20:00:00', ${regionId}, ${cityId})
      RETURNING election_id;
    `);

    const electionId = electionRes.rows[0].election_id;

    console.log("Populating candidates...");
    const candidateRes = await pool.query(`
      INSERT INTO candidates (user_id, election_id, bio, party, avatar_url)
      VALUES 
        (${candidateUserIds[0]}, ${electionId}, 'Опытный политик.', 'Партия  А', 'https://example.com/avatar1.jpg'),
        (${candidateUserIds[1]}, ${electionId}, 'Борец за правосудие.', 'Партия Б', 'https://example.com/avatar2.jpg'),
        (${candidateUserIds[2]}, ${electionId}, 'Новый вгляд на мир.', 'Партия В', 'https://example.com/avatar3.jpg')
      RETURNING candidate_id;
    `);

    const candidateIds = candidateRes.rows.map((row) => row.candidate_id);

    console.log("Recording votes...");
    const votes = voterIds.map((userId, index) => {
      const candidateId = candidateIds[index % 3];
      return `(${candidateId}, ${electionId}, 'randomToken${userId}')`;
    });

    await pool.query(`
      INSERT INTO voters (candidate_id, election_id, token)
      VALUES ${votes.join(", ")}
    `);

    await pool.query(`
      INSERT INTO is_voted (user_id, election_id)
      VALUES ${voterIds
        .map((userId) => `(${userId}, ${electionId})`)
        .join(", ")}
    `);

    console.log("Populating system events...");
    await pool.query(`
      INSERT INTO system_events (title, description, event_date)
      VALUES 
        ('Выборы Президента', 'Описание.', NOW() + INTERVAL '1 day');
    `);

    await pool.query("COMMIT");
    console.log("Database successfully populated with sample data.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error populating data:", err);
  } finally {
    pool.end();
  }
}

populateData();
