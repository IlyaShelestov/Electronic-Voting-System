const request = require("supertest");
const server = require("../../src/index");
const pool = require("../../src/config/db");

describe("Auth API Tests", () => {
  beforeAll(async () => {
    await pool.query(`SELECT 1`);
  });

  afterAll(async () => {
    try {
      await pool.query("DELETE FROM users WHERE iin = $1", ["123456789012"]);
      await pool.end();
      server.close();
    } catch (err) {
      console.log("Error during cleanup:", err);
      throw err;
    }
  });

  test("Should register a user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      iin: "123456789012",
      name: "TestName",
      surname: "TestSurname",
      patronymic: "TestPatronymic",
      birth_date: "2021-01-01",
      region: "TestRegion",
      city: "TestCity",
      phone: "1234567890",
      password: "testpassword",
    });

    expect(res.status).toBe(201);
    expect(res.body[0]).toHaveProperty("iin", "123456789012");
    expect(res.body[0]).toHaveProperty("name", "TestName");
    expect(res.body[0]).toHaveProperty("surname", "TestSurname");
    expect(res.body[0]).toHaveProperty("patronymic", "TestPatronymic");
    expect(res.body[0]).toHaveProperty("birth_date", "2021-01-01");
    expect(res.body[0]).toHaveProperty("region", "TestRegion");
    expect(res.body[0]).toHaveProperty("city", "TestCity");
    expect(res.body[0]).toHaveProperty("phone", "1234567890");
    expect(res.body[0]).toHaveProperty("role", "user");
    expect(res.body[0]).toHaveProperty("password");
    expect(res.body[0]).toHaveProperty("created_at");
    expect(res.body[0]).toHaveProperty("updated_at");
  });

  test("Should login a user", async () => {
    const res = await request(server).post("/api/auth/login").send({
      iin: "123456789012",
      password: "testpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
