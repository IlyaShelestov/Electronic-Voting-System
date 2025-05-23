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
      user11: "User123!",
      user12: "User123!",
      user13: "User123!",
      user14: "User123!",
      user15: "User123!",
    };

    const hashedPasswords = {};
    for (const key in plainPasswords) {
      hashedPasswords[key] = await bcrypt.hash(plainPasswords[key], 10);
    }

    console.log("Inserting regions...");
    const regions = [
      "Астана",
      "Алматы",
      "Шымкент",
      "Актюбинская область",
      "Атырауская область",
      "Мангистауская область",
      "Карагандинская область",
      "Павлодарская область",
      "Северо-Казахстанская область",
      "Костанайская область",
      "Западно-Казахстанская область",
      "Восточно-Казахстанская область",
      "Акмолинская область",
      "Кызылординская область",
      "Жамбылская область",
      "Туркестанская область",
    ];

    const regionsMap = {};
    for (const region of regions) {
      const result = await pool.query(
        "INSERT INTO regions (name) VALUES ($1) RETURNING region_id;",
        [region]
      );
      regionsMap[region] = result.rows[0].region_id;
    }

    console.log("Inserting cities...");
    const cities = [
      { name: "Алматы", region: "Алматы" },
      { name: "Астана", region: "Астана" },
      { name: "Шымкент", region: "Шымкент" },
      { name: "Актобе", region: "Актюбинская область" },
      { name: "Атырау", region: "Атырауская область" },
      { name: "Актау", region: "Мангистауская область" },
      { name: "Караганда", region: "Карагандинская область" },
      { name: "Павлодар", region: "Павлодарская область" },
      { name: "Петропавловск", region: "Северо-Казахстанская область" },
      { name: "Костанай", region: "Костанайская область" },
      { name: "Уральск", region: "Западно-Казахстанская область" },
      { name: "Усть-Каменогорск", region: "Восточно-Казахстанская область" },
      { name: "Кокшетау", region: "Акмолинская область" },
      { name: "Кызылорда", region: "Кызылординская область" },
      { name: "Тараз", region: "Жамбылская область" },
      { name: "Туркестан", region: "Туркестанская область" },
    ];

    const citiesMap = {};
    for (const city of cities) {
      const result = await pool.query(
        "INSERT INTO cities (name, region_id) VALUES ($1, $2) RETURNING city_id;",
        [city.name, regionsMap[city.region]]
      );
      citiesMap[city.name] = result.rows[0].city_id;
    }

    const defaultCityId = citiesMap["Астана"];
    const defaultRegionId = regionsMap["Астана"];

    console.log("Populating users...");
    const userRes = await pool.query(`
      INSERT INTO users (iin, first_name, last_name, patronymic, phone_number, email, date_of_birth, city_id, password_hash, role)
      VALUES 
      ('111111111111', 'Админ', 'Пользователь', NULL, '+77010000000', 'admin@example.com', '1980-01-01', ${defaultCityId}, '${hashedPasswords.admin}', 'admin'),
      ('222222222222', 'Менеджер', 'Пользователь', NULL, '+77010000001', 'manager@example.com', '1985-01-01', ${defaultCityId}, '${hashedPasswords.manager}', 'manager'),
      ('333333333333', 'Иван', 'Кандидат', NULL, '+77010000002', 'ivan@example.com', '1990-02-15', ${defaultCityId}, '${hashedPasswords.candidate1}', 'user'),
      ('444444444444', 'Алексей', 'Кандидат', NULL, '+77010000003', 'alexey@example.com', '1985-03-20', ${defaultCityId}, '${hashedPasswords.candidate2}', 'user'),
      ('555555555555', 'Мария', 'Кандидат', NULL, '+77010000004', 'maria@example.com', '1988-07-25', ${defaultCityId}, '${hashedPasswords.candidate3}', 'user'),
      ('666666666666', 'Сергей', 'Пользователь', NULL, '+77010000005', 'sergey@example.com', '1992-05-10', ${defaultCityId}, '${hashedPasswords.user1}', 'user'),
      ('777777777777', 'Николай', 'Пользователь', NULL, '+77010000006', 'nikolay@example.com', '1993-03-10', ${defaultCityId}, '${hashedPasswords.user2}', 'user'),
      ('888888888888', 'Петр', 'Пользователь', NULL, '+77010000007', 'petr@example.com', '1994-02-11', ${defaultCityId}, '${hashedPasswords.user3}', 'user'),
      ('999999999999', 'Дмитрий', 'Пользователь', NULL, '+77010000008', 'dmitry@example.com', '1995-01-12', ${defaultCityId}, '${hashedPasswords.user4}', 'user'),
      ('121212121212', 'Андрей', 'Пользователь', NULL, '+77010000009', 'andrey@example.com', '1986-08-13', ${defaultCityId}, '${hashedPasswords.user5}', 'user'),
      ('131313131313', 'Константин', 'Пользователь', NULL, '+77010000010', 'konstantin@example.com', '1987-07-14', ${defaultCityId}, '${hashedPasswords.user6}', 'user'),
      ('141414141414', 'Ольга', 'Пользователь', NULL, '+77010000011', 'olga@example.com', '1982-02-15', ${defaultCityId}, '${hashedPasswords.user7}', 'user'),
      ('151515151515', 'Екатерина', 'Пользователь', NULL, '+77010000012', 'ekaterina@example.com', '1983-01-16', ${defaultCityId}, '${hashedPasswords.user8}', 'user'),
      ('161616161616', 'Василий', 'Пользователь', NULL, '+77010000013', 'vasiliy@example.com', '1984-03-17', ${defaultCityId}, '${hashedPasswords.user9}', 'user'),
      ('171717171717', 'Татьяна', 'Пользователь', NULL, '+77010000014', 'tatiana@example.com', '1985-02-18', ${defaultCityId}, '${hashedPasswords.user10}', 'user'),
      -- new users
      ('181818181818', 'Леонид', 'Пользователь', NULL, '+77010000015', 'user11@example.com', '1991-09-19', ${defaultCityId}, '${hashedPasswords.user11}', 'user'),
      ('191919191919', 'Евгений', 'Пользователь', NULL, '+77010000016', 'user12@example.com', '1992-10-20', ${defaultCityId}, '${hashedPasswords.user12}', 'user'),
      ('202020202020', 'Марина', 'Пользователь', NULL, '+77010000017', 'user13@example.com', '1993-11-21', ${defaultCityId}, '${hashedPasswords.user13}', 'user'),
      ('212121212121', 'Олег', 'Пользователь', NULL, '+77010000018', 'user14@example.com', '1994-12-22', ${defaultCityId}, '${hashedPasswords.user14}', 'user'),
      ('222222222223', 'Светлана', 'Пользователь', NULL, '+77010000019', 'user15@example.com', '1995-01-23', ${defaultCityId}, '${hashedPasswords.user15}', 'user')
      RETURNING user_id;
    `);

    const userIds = userRes.rows.map((row) => row.user_id);
    const candidateUserIds = userIds.slice(2, 5);
    const voterIds = userIds.slice(5);

    console.log("Populating election...");
    const electionRes = await pool.query(`
      INSERT INTO elections (title, start_date, end_date, region_id, city_id)
      VALUES ('Astana Elections', '2025-03-01 08:00:00', '2025-03-06 20:00:00', ${defaultRegionId}, ${defaultCityId})
      RETURNING election_id;
    `);

    const electionId = electionRes.rows[0].election_id;

    console.log("Populating candidates...");
    const candidateRes = await pool.query(`
      INSERT INTO candidates (user_id, election_id, bio, party, avatar_url)
      VALUES 
        (${candidateUserIds[0]}, ${electionId}, 'Опытный политик.', 'Партия  А', 'https://img.freepik.com/premium-photo/young-man-isolated-blue_1368-124991.jpg?semt=ais_hybrid&w=740'),
        (${candidateUserIds[1]}, ${electionId}, 'Борец за правосудие.', 'Партия Б', 'https://st.depositphotos.com/1144472/2003/i/450/depositphotos_20030237-stock-photo-cheerful-young-man-over-white.jpg'),
        (${candidateUserIds[2]}, ${electionId}, 'Новый взгляд на мир.', 'Партия В', 'https://thumbs.dreamstime.com/b/portrait-beautiful-happy-woman-white-teeth-smiling-beauty-attractive-healthy-girl-perfect-smile-blonde-hair-fresh-face-76138238.jpg')
      RETURNING candidate_id;
    `);

    const candidateIds = candidateRes.rows.map((row) => row.candidate_id);

    console.log("Recording votes on different days...");
    const votes = voterIds.map((userId, index) => {
      const candidateId = candidateIds[index % candidateIds.length];
      const dayOffset = Math.floor(Math.random() * 6);
      return `(
        ${candidateId},
        ${electionId},
        'token${userId}',
        '2025-03-01 08:00:00'::timestamp + INTERVAL '${dayOffset} days'
      )`;
    });

    await pool.query(`
      INSERT INTO voters (candidate_id, election_id, token, voted_at)
      VALUES ${votes.join(",\n")}
    `);

    await pool.query(`
      INSERT INTO is_voted (user_id, election_id)
      VALUES ${voterIds
        .map((userId) => `(${userId}, ${electionId})`)
        .join(", ")};
    `);

    console.log("Populating system events...");
    await pool.query(`
      INSERT INTO system_events (title, description, event_date)
      VALUES 
        ('Выборы Акима Астаны', 'Описание.', NOW() + INTERVAL '1 day');
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
