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

    console.log("Populating users...");
    const userRes = await pool.query(`
      INSERT INTO users (iin, first_name, last_name, patronymic, phone_number, email, date_of_birth, region, city, password_hash, role)
      VALUES 
        -- Admin
        ('111111111111', 'Admin', 'User', NULL, '+77010000000', 'admin@example.com', '1980-01-01', 'Astana', 'Astana', '${hashedPasswords.admin}', 'admin'),
        
        -- Manager
        ('222222222222', 'Manager', 'User', NULL, '+77010000001', 'manager@example.com', '1985-01-01', 'Astana', 'Astana', '${hashedPasswords.manager}', 'manager'),
        
        -- Candidates
        ('333333333333', 'Alice', 'Candidate', NULL, '+77010000002', 'alice@example.com', '1990-02-15', 'Astana', 'Astana', '${hashedPasswords.candidate1}', 'user'),
        ('444444444444', 'Bob', 'Candidate', NULL, '+77010000003', 'bob@example.com', '1985-03-20', 'Astana', 'Astana', '${hashedPasswords.candidate2}', 'user'),
        ('555555555555', 'Charlie', 'Candidate', NULL, '+77010000004', 'charlie@example.com', '1988-07-25', 'Astana', 'Astana', '${hashedPasswords.candidate3}', 'user'),
        
        -- Regular Users
        ('666666666666', 'David', 'User', NULL, '+77010000005', 'david@example.com', '1992-05-10', 'Astana', 'Astana', '${hashedPasswords.user1}', 'user'),
        ('777777777777', 'Emma', 'User', NULL, '+77010000006', 'emma@example.com', '1993-06-15', 'Astana', 'Astana', '${hashedPasswords.user2}', 'user'),
        ('888888888888', 'Frank', 'User', NULL, '+77010000007', 'frank@example.com', '1991-08-05', 'Astana', 'Astana', '${hashedPasswords.user3}', 'user'),
        ('999999999999', 'Grace', 'User', NULL, '+77010000008', 'grace@example.com', '1994-09-12', 'Astana', 'Astana', '${hashedPasswords.user4}', 'user'),
        ('101010101010', 'Hank', 'User', NULL, '+77010000009', 'hank@example.com', '1995-10-22', 'Astana', 'Astana', '${hashedPasswords.user5}', 'user'),
        ('121212121212', 'Ivy', 'User', NULL, '+77010000010', 'ivy@example.com', '1996-11-30', 'Astana', 'Astana', '${hashedPasswords.user6}', 'user'),
        ('131313131313', 'Jack', 'User', NULL, '+77010000011', 'jack@example.com', '1997-12-18', 'Astana', 'Astana', '${hashedPasswords.user7}', 'user'),
        ('141414141414', 'Kate', 'User', NULL, '+77010000012', 'kate@example.com', '1998-04-25', 'Astana', 'Astana', '${hashedPasswords.user8}', 'user'),
        ('151515151515', 'Leo', 'User', NULL, '+77010000013', 'leo@example.com', '1999-05-05', 'Astana', 'Astana', '${hashedPasswords.user9}', 'user'),
        ('161616161616', 'Mia', 'User', NULL, '+77010000014', 'mia@example.com', '2000-06-14', 'Astana', 'Astana', '${hashedPasswords.user10}', 'user')
      RETURNING user_id;
    `);

    const userIds = userRes.rows.map((row) => row.user_id);
    const candidateUserIds = userIds.slice(2, 5);
    const voterIds = userIds.slice(5);

    console.log("Populating election...");
    const electionRes = await pool.query(`
      INSERT INTO elections (title, start_date, end_date, region, city)
      VALUES 
        ('Presidential Election', '2025-03-01 08:00:00', '2025-03-01 20:00:00', 'Astana', 'Astana')
      RETURNING election_id;
    `);

    const electionId = electionRes.rows[0].election_id;

    console.log("Populating candidates...");
    const candidateRes = await pool.query(`
      INSERT INTO candidates (user_id, election_id, bio, party, avatar_url)
      VALUES 
        (${candidateUserIds[0]}, ${electionId}, 'Experienced politician with a vision.', 'Party A', 'https://example.com/avatar1.jpg'),
        (${candidateUserIds[1]}, ${electionId}, 'Fighting for social justice.', 'Party B', 'https://example.com/avatar2.jpg'),
        (${candidateUserIds[2]}, ${electionId}, 'A fresh perspective on governance.', 'Party C', 'https://example.com/avatar3.jpg')
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
        ('Election Created', 'The Presidential Election has been set up.', NOW()),
        ('Voting Started', 'The voting process has begun.', NOW() + INTERVAL '1 day'),
        ('Voting Ended', 'The voting process has ended.', NOW() + INTERVAL '2 days');
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
