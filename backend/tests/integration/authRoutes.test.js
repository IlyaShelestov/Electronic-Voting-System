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
      first_name: "TestName",
      last_name: "TestSurname",
      patronymic: "TestPatronymic",
      date_of_birth: "2021-01-01",
      region: "TestRegion",
      city: "TestCity",
      phone_number: "1234567890",
      email: "TestEmail",
      password: "TestPassword",
    });

    expect(res.status).toBe(201);
    expect(res.body[0]).toHaveProperty("iin", "123456789012");
    expect(res.body[0]).toHaveProperty("first_name", "TestName");
    expect(res.body[0]).toHaveProperty("last_name", "TestSurname");
    expect(res.body[0]).toHaveProperty("patronymic", "TestPatronymic");
    expect(res.body[0]).toHaveProperty("date_of_birth", "2021-01-01");
    expect(res.body[0]).toHaveProperty("region", "TestRegion");
    expect(res.body[0]).toHaveProperty("city", "TestCity");
    expect(res.body[0]).toHaveProperty("phone_number", "1234567890");
    expect(res.body[0]).toHaveProperty("email", "TestEmail");
    expect(res.body[0]).toHaveProperty("role", "user");
    expect(res.body[0]).toHaveProperty("password_hash");
    expect(res.body[0]).toHaveProperty("created_at");
    expect(res.body[0]).toHaveProperty("updated_at");
  });

  test("Should login a user", async () => {
    const res = await request(server).post("/api/auth/login").send({
      iin: "123456789012",
      password: "TestPassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
