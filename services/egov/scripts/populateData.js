require("../src/config/environment");
const pool = require("../src/config/db");

async function populateData() {
  try {
    await pool.query("BEGIN");
    await pool.query(`
                INSERT INTO citizens (iin, phone_number, email)
                VALUES
                ('111111111111', '+77010000000', 'admin@example.com'),
                ('222222222222', '+77010000001', 'manager@example.com'),
                ('333333333333', '+77010000002', 'ivan@example.com'),
                ('444444444444', '+77010000003', 'alexey@example.com'),
                ('555555555555', '+77010000004', 'maria@example.com'),
                ('666666666666', '+77010000005', 'sergey@example.com'),
                ('777777777777', '+77010000006', 'nikolay@example.com'),
                ('888888888888', '+77010000007', 'petr@example.com'),
                ('999999999999', '+77010000008', 'dmitry@example.com'),
                ('121212121212', '+77010000009', 'andrey@example.com'),
                ('131313131313', '+77010000010', 'konstantin@example.com'),
                ('141414141414', '+77010000011', 'olga@example.com'),
                ('151515151515', '+77010000012', 'ekaterina@example.com'),
                ('161616161616', '+77010000013', 'vasiliy@example.com'),
                ('171717171717', '+77010000014', 'tatiana@example.com'),
                ('181818181818', '+77010000015', 'user11@example.com'),
                ('191919191919', '+77010000016', 'user12@example.com'),
                ('202020202020', '+77010000017', 'user13@example.com'),
                ('212121212121', '+77010000018', 'user14@example.com'),
                ('222222222223', '+77010000019', 'user15@example.com');
            `);
    await pool.query("COMMIT");
    console.log("Data populated successfully.");
  } catch (err) {
    pool.query("ROLLBACK");
    console.error("Error populating data:", err);
  } finally {
    pool.end();
  }
}

populateData();
