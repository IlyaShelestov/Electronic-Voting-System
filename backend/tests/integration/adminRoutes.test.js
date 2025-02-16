const request = require("supertest");
const { getAdminToken } = require("../helpers/tokenHelper");
const { createStandardUser } = require("../helpers/usersHelper");
const app = require("../../src/index");

describe("Admin API Integration Tests", () => {
  beforeAll(async () => {
    token = getAdminToken();
  });

  //   describe("GET /api/admin/users", () => {
  //     it("should return a list of users", async () => {

  //     })
  //   })

  describe("POST /api/admin/users", () => {
    it("should create a new user", async () => {
      const newUser = {
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
        role: "user",
      };

      const res = await request(app)
        .post("/api/admin/users")
        .set("Cookie", `token=${token}`)
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        iin: newUser.iin,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        patronymic: newUser.patronymic,
        date_of_birth: newUser.date_of_birth,
        region: newUser.region,
        city: newUser.city,
        phone_number: newUser.phone_number,
        email: newUser.email,
        role: newUser.role,
      });
      expect(res.body).toHaveProperty("user_id");
      expect(res.body).toHaveProperty("created_at");
      expect(res.body).toHaveProperty("updated_at");
    });
  });

  // describe("PUT /api/admin/users/:id", () => {

  // })

  describe("DELETE /api/admin/users/:id", () => {
    it("should delete a user", async () => {
      const user = await createStandardUser();
      const res = await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...user,
        date_of_birth: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });
});
