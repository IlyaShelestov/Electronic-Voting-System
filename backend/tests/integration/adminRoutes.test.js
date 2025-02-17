const request = require("supertest");
const { getAdminToken } = require("../helpers/tokenHelper");
const { createStandardUser } = require("../helpers/usersHelper");
const app = require("../../src/index");

describe("Admin API Integration Tests", () => {
  beforeAll(async () => {
    token = getAdminToken();
  });

  describe("GET /api/admin/users", () => {
    it("should return a list of users", async () => {
      const user1 = await createStandardUser();
      const user2 = await createStandardUser();
      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...user1,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            ...user2,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      );
    });
  });

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

  describe("PUT /api/admin/users/:id", () => {
    it("should update a user", async () => {
      const user = await createStandardUser();
      const updatedData = {
        first_name: "UpdatedName",
        last_name: "UpdatedSurname",
        patronymic: "UpdatedPatronymic",
        date_of_birth: "2021-01-02",
        region: "UpdatedRegion",
        city: "UpdatedCity",
        phone_number: "0987654321",
        email: "UpdatedEmail",
        role: "user",
      };

      const res = await request(app)
        .put(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...updatedData,
        user_id: user.user_id,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    it("should delete a user", async () => {
      const user = await createStandardUser();
      const res = await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...user,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/999999`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });

    it("should return 410 if user already deleted", async () => {
      const user = await createStandardUser();
      await createStandardUser();
      await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${token}`);
      const res = await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${token}`);
      expect(res.status).toBe(410);
      expect(res.body).toMatchObject({ message: "User already deleted" });
    });
  });
});
