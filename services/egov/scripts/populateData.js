require("../src/config/environment");
const pool = require("../src/config/db");

async function populateData() {
  try {
    await pool.query("BEGIN");

    console.log("Populating citizens data...");

    // Admin and Manager
    let citizenValues = `
      ('111111111111', '+77220000000', 'admin@example.com'),
      ('222222222222', '+77220000001', 'manager@example.com')`;

    // 12 Candidates
    for (let i = 0; i < 12; i++) {
      const iin = `3${i.toString().padStart(11, "0")}`;
      citizenValues += `,
      ('${iin}', '+7701000${(i + 100)
        .toString()
        .padStart(4, "0")}', 'candidate${i + 1}@example.com')`;
    }

    // 100 Regular users
    for (let i = 0; i < 100; i++) {
      const iin = `9${i.toString().padStart(11, "0")}`;
      citizenValues += `,
      ('${iin}', '+7701${i.toString().padStart(7, "0")}', 'user${
        i + 1
      }@example.com')`;
    }

    await pool.query(`
      INSERT INTO citizens (iin, phone_number, email)
      VALUES ${citizenValues}
    `);

    await pool.query("COMMIT");
    console.log("Citizens data populated successfully.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error populating data:", err);
  } finally {
    pool.end();
  }
}

populateData();
