require("../src/config/environment");
const pool = require("../src/config/db");
const bcrypt = require("bcrypt");

async function populateData() {
  try {
    await pool.query("BEGIN");

    console.log("Hashing passwords...");
    // Simplified password structure - only two types
    const passwordHashes = {
      admin: await bcrypt.hash("Admin123!", 10),
      manager: await bcrypt.hash("Manager123!", 10),
      candidate: await bcrypt.hash("Candidate123!", 10),
      user: await bcrypt.hash("User123!", 10),
    };

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

    // Cities and regions for our elections
    const astanaRegionId = regionsMap["Астана"];
    const astanaCityId = citiesMap["Астана"];
    const almatyRegionId = regionsMap["Алматы"];
    const almatyCityId = citiesMap["Алматы"];

    console.log("Populating users...");
    // Create admin and manager
    let userInsertValues = `
      ('111111111111', 'Админ', 'Пользователь', NULL, '+77220000000', 'admin@example.com', '1980-01-01', ${astanaCityId}, '${passwordHashes.admin}', 'admin'),
      ('222222222222', 'Менеджер', 'Пользователь', NULL, '+77220000001', 'manager@example.com', '1985-01-01', ${astanaCityId}, '${passwordHashes.manager}', 'manager')`;

    // Create 12 candidates
    const candidateNames = [
      "Иван",
      "Алексей",
      "Мария",
      "Сергей",
      "Анна",
      "Дмитрий",
      "Елена",
      "Михаил",
      "Ольга",
      "Николай",
      "Виктория",
      "Александр",
    ];

    for (let i = 0; i < 12; i++) {
      const iin = `3${i.toString().padStart(11, "0")}`;
      userInsertValues += `,
      ('${iin}', '${candidateNames[i]}', 'Кандидат', NULL, '+7701000${(i + 100)
        .toString()
        .padStart(4, "0")}', 'candidate${i + 1}@example.com', '1990-0${
        (i % 9) + 1
      }-${(i % 20) + 1}', ${i < 7 ? astanaCityId : almatyCityId}, '${
        passwordHashes.candidate
      }', 'user')`;
    }

    // Create 100 regular users
    for (let i = 0; i < 100; i++) {
      const iin = `9${i.toString().padStart(11, "0")}`;
      const cityId = i < 50 ? astanaCityId : almatyCityId; // First 50 in Astana, next 50 in Almaty
      userInsertValues += `,
      ('${iin}', 'Пользователь${i + 1}', 'Фамилия${i + 1}', NULL, '+7701${i
        .toString()
        .padStart(7, "0")}', 'user${i + 1}@example.com', '1980-0${
        (i % 9) + 1
      }-${(i % 20) + 1}', ${cityId}, '${passwordHashes.user}', 'user')`;
    }

    const userRes = await pool.query(`
      INSERT INTO users (iin, first_name, last_name, patronymic, phone_number, email, date_of_birth, city_id, password_hash, role)
      VALUES ${userInsertValues}
      RETURNING user_id;
    `);

    const userIds = userRes.rows.map((row) => row.user_id);
    // Skip admin and manager (first 2 users)
    const candidateUserIds = userIds.slice(2, 14); // 12 candidates
    const voterIds = userIds.slice(14); // 100 normal users

    // Divide voters by region
    const astanaVoterIds = voterIds.slice(0, 50);
    const almatyVoterIds = voterIds.slice(50);

    console.log("Populating elections...");
    const electionsRes = await pool.query(`
      INSERT INTO elections (title, start_date, end_date, region_id, city_id)
      VALUES 
        ('Astana Elections 2025', '2025-03-01 08:00:00', '2025-03-06 20:00:00', ${astanaRegionId}, ${astanaCityId}),
        ('Astana City Council', '2025-04-01 08:00:00', '2025-04-06 20:00:00', ${astanaRegionId}, ${astanaCityId}),
        ('Almaty Elections 2025', '2025-05-01 08:00:00', '2025-05-06 20:00:00', ${almatyRegionId}, ${almatyCityId}),
        ('Almaty City Council', '2025-06-01 08:00:00', '2025-06-06 20:00:00', ${almatyRegionId}, ${almatyCityId})
      RETURNING election_id;
    `);

    const electionIds = electionsRes.rows.map((row) => row.election_id);

    console.log("Populating candidates...");
    // Candidate photos
    const candidatePhotos = [
      "https://img.freepik.com/premium-photo/young-man-isolated-blue_1368-124991.jpg?semt=ais_hybrid&w=740",
      "https://st.depositphotos.com/1144472/2003/i/450/depositphotos_20030237-stock-photo-cheerful-young-man-over-white.jpg",
      "https://thumbs.dreamstime.com/b/portrait-beautiful-happy-woman-white-teeth-smiling-beauty-attractive-healthy-girl-perfect-smile-blonde-hair-fresh-face-76138238.jpg",
    ];

    // Election 1: 3 candidates
    const election1Candidates = candidateUserIds.slice(0, 3);
    // Election 2: 4 candidates
    const election2Candidates = candidateUserIds.slice(3, 7);
    // Election 3: 2 candidates
    const election3Candidates = candidateUserIds.slice(7, 9);
    // Election 4: 3 candidates
    const election4Candidates = candidateUserIds.slice(9, 12);

    const partiesNames = [
      "Партия A",
      "Партия Б",
      "Партия В",
      "Партия Г",
      "Партия Д",
    ];

    let candidateInsertValues = "";

    // Election 1 candidates
    election1Candidates.forEach((userId, idx) => {
      candidateInsertValues += `${candidateInsertValues ? "," : ""}
        (${userId}, ${electionIds[0]}, 'Кандидат с опытом работы ${
        5 + idx
      } лет.', '${partiesNames[idx % partiesNames.length]}', '${
        candidatePhotos[idx % candidatePhotos.length]
      }')`;
    });

    // Election 2 candidates
    election2Candidates.forEach((userId, idx) => {
      candidateInsertValues += `,
        (${userId}, ${electionIds[1]}, 'Опыт в городском управлении ${
        3 + idx
      } лет.', '${partiesNames[(idx + 1) % partiesNames.length]}', '${
        candidatePhotos[idx % candidatePhotos.length]
      }')`;
    });

    // Election 3 candidates
    election3Candidates.forEach((userId, idx) => {
      candidateInsertValues += `,
        (${userId}, ${electionIds[2]}, 'Лидер общественного мнения с ${
        8 + idx
      } годами опыта.', '${partiesNames[(idx + 2) % partiesNames.length]}', '${
        candidatePhotos[idx % candidatePhotos.length]
      }')`;
    });

    // Election 4 candidates
    election4Candidates.forEach((userId, idx) => {
      candidateInsertValues += `,
        (${userId}, ${
        electionIds[3]
      }, 'Эксперт в области экономики и развития.', '${
        partiesNames[(idx + 3) % partiesNames.length]
      }', '${candidatePhotos[idx % candidatePhotos.length]}')`;
    });

    const candidateRes = await pool.query(`
      INSERT INTO candidates (user_id, election_id, bio, party, avatar_url)
      VALUES ${candidateInsertValues}
      RETURNING candidate_id, election_id;
    `);

    // Map to store candidate IDs by election
    const candidatesByElection = {};
    candidateRes.rows.forEach((row) => {
      if (!candidatesByElection[row.election_id]) {
        candidatesByElection[row.election_id] = [];
      }
      candidatesByElection[row.election_id].push(row.candidate_id);
    });

    console.log("Recording votes on different days...");
    // 50 Astana voters for elections 1 and 2
    const astanaVotes = [];

    // Votes for election 1 - all 50 Astana voters
    astanaVoterIds.forEach((userId, idx) => {
      const electionId = electionIds[0];
      const candidates = candidatesByElection[electionId];
      const candidateId =
        candidates[Math.floor(Math.random() * candidates.length)];
      const dayOffset = Math.floor(Math.random() * 6);

      astanaVotes.push(`(
        ${candidateId},
        ${electionId},
        'token${userId}_${electionId}',
        '2025-03-01 08:00:00'::timestamp + INTERVAL '${dayOffset} days'
      )`);
    });

    // Votes for election 2 - all 50 Astana voters
    astanaVoterIds.forEach((userId, idx) => {
      const electionId = electionIds[1];
      const candidates = candidatesByElection[electionId];
      const candidateId =
        candidates[Math.floor(Math.random() * candidates.length)];
      const dayOffset = Math.floor(Math.random() * 6);

      astanaVotes.push(`(
        ${candidateId},
        ${electionId},
        'token${userId}_${electionId}',
        '2025-04-01 08:00:00'::timestamp + INTERVAL '${dayOffset} days'
      )`);
    });

    // 50 Almaty voters for elections 3 and 4
    const almatyVotes = [];

    // Votes for election 3 - all 50 Almaty voters
    almatyVoterIds.forEach((userId, idx) => {
      const electionId = electionIds[2];
      const candidates = candidatesByElection[electionId];
      const candidateId =
        candidates[Math.floor(Math.random() * candidates.length)];
      const dayOffset = Math.floor(Math.random() * 6);

      almatyVotes.push(`(
        ${candidateId},
        ${electionId},
        'token${userId}_${electionId}',
        '2025-05-01 08:00:00'::timestamp + INTERVAL '${dayOffset} days'
      )`);
    });

    // Votes for election 4 - all 50 Almaty voters
    almatyVoterIds.forEach((userId, idx) => {
      const electionId = electionIds[3];
      const candidates = candidatesByElection[electionId];
      const candidateId =
        candidates[Math.floor(Math.random() * candidates.length)];
      const dayOffset = Math.floor(Math.random() * 6);

      almatyVotes.push(`(
        ${candidateId},
        ${electionId},
        'token${userId}_${electionId}',
        '2025-06-01 08:00:00'::timestamp + INTERVAL '${dayOffset} days'
      )`);
    });

    await pool.query(`
      INSERT INTO voters (candidate_id, election_id, token, voted_at)
      VALUES ${[...astanaVotes, ...almatyVotes].join(",\n")}
    `);

    // Record which users have voted
    let isVotedValues = [];

    // Record Astana voters for elections 1 and 2
    astanaVoterIds.forEach((userId) => {
      isVotedValues.push(`(${userId}, ${electionIds[0]})`);
      isVotedValues.push(`(${userId}, ${electionIds[1]})`);
    });

    // Record Almaty voters for elections 3 and 4
    almatyVoterIds.forEach((userId) => {
      isVotedValues.push(`(${userId}, ${electionIds[2]})`);
      isVotedValues.push(`(${userId}, ${electionIds[3]})`);
    });

    await pool.query(`
      INSERT INTO is_voted (user_id, election_id)
      VALUES ${isVotedValues.join(", ")};
    `);

    console.log("Populating system events...");
    await pool.query(`
      INSERT INTO system_events (title, description, event_date)
      VALUES 
        ('Начало регистрации кандидатов в Астане', 'Открыта регистрация кандидатов на выборы Акима Астаны. Подробности на официальном сайте.', NOW() - INTERVAL '60 days'),
        ('Начало предвыборной кампании', 'Официальный старт предвыборной кампании. Дебаты состоятся через неделю.', NOW() - INTERVAL '30 days'),
        ('Выборы Акима Астаны', 'Приглашаем всех избирателей принять участие в голосовании.', NOW() + INTERVAL '1 day'),
        ('Выборы в городской совет Алматы', 'Важное событие для жителей Алматы.', NOW() + INTERVAL '30 days'),
        ('Дебаты кандидатов', 'Прямая трансляция дебатов кандидатов на пост Акима.', NOW() + INTERVAL '7 days'),
        ('Подведение итогов голосования', 'Объявление результатов выборов и инаугурация нового Акима.', NOW() + INTERVAL '10 days')
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
