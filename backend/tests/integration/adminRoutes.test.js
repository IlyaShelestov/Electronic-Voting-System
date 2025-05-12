const request = require("supertest");
const { getAdminToken, getUserToken } = require("../helpers/tokenHelper");
const { createStandardUser } = require("../helpers/usersHelper");
const { createCity, createRegion } = require("../helpers/entitiesHelper");
const app = require("../../src/index");

describe("Admin API Integration Tests", () => {
  let adminToken;
  let userToken;
  beforeAll(async () => {
    adminToken = getAdminToken();
    userToken = getUserToken();
  });
  beforeEach(async () => {
    await createRegion();
    await createRegion({ name: "TestRegion2" });
    await createCity();
    await createCity({ region_id: 2, name: "TestCity2" });
  });

  describe("GET /api/admin/users", () => {
    it("should return a list of users", async () => {
      const user1 = await createStandardUser();
      const user2 = await createStandardUser();
      const res = await request(app)
        .get("/api/admin/users")
        .set("Cookie", `token=${adminToken}`);

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

    it("should return 401 if not logged in", async () => {
      const res = await request(app).get(`/api/admin/users`);
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });

    it("should return 403 if not admin", async () => {
      const res = await request(app)
        .get(`/api/admin/users`)
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Forbidden" });
    });
  });

  describe("POST /api/admin/users", () => {
    it("should create a new user", async () => {
      const newUser = {
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        city_id: 1,
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "!W152Sdsbx",
        role: "user",
      };

      const res = await request(app)
        .post("/api/admin/users")
        .set("Cookie", `token=${adminToken}`)
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        iin: newUser.iin,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        patronymic: newUser.patronymic,
        date_of_birth: newUser.date_of_birth,
        city_id: newUser.city_id,
        phone_number: newUser.phone_number,
        email: newUser.email,
        role: newUser.role,
      });
      expect(res.body).toHaveProperty("user_id");
      expect(res.body).toHaveProperty("created_at");
      expect(res.body).toHaveProperty("updated_at");
    });

    it("should return 400 if missing required fields", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Cookie", `token=${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ message: "Missing required fields" });
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).post(`/api/admin/users`).send({});
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });

    it("should return 403 if not admin", async () => {
      const res = await request(app)
        .post(`/api/admin/users`)
        .set("Cookie", `token=${userToken}`)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Forbidden" });
    });
  });

  describe("PUT /api/admin/users/:id", () => {
    it("should update a user", async () => {
      const user = await createStandardUser();
      const updatedData = {
        first_name: "Александр",
        last_name: "Александров",
        patronymic: "Александрович",
        date_of_birth: "2021-01-02",
        city_id: 2,
        phone_number: "87071234568",
        email: "testemail2@gmail.com",
        role: "user",
      };

      const res = await request(app)
        .put(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...updatedData,
        user_id: user.user_id,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it("should return 409 if email is already used", async () => {
      const user = await createStandardUser();
      const user2 = await createStandardUser();
      const updatedData = {
        email: user2.email,
      };
      const res = await request(app)
        .put(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`)
        .send(updatedData);
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({ message: "Email already exists" });
    });

    it("should return 409 if phone number is already used", async () => {
      const user = await createStandardUser();
      const user2 = await createStandardUser();
      const updatedData = {
        phone_number: user2.phone_number,
      };
      const res = await request(app)
        .put(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`)
        .send(updatedData);
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        message: "Phone number already exists",
      });
    });

    it("should return 409 if iin is already used", async () => {
      const user = await createStandardUser();
      const user2 = await createStandardUser();
      const updatedData = {
        iin: user2.iin,
      };
      const res = await request(app)
        .put(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`)
        .send(updatedData);
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({ message: "IIN already exists" });
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).put(`/api/admin/users/0`).send({});
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });

    it("should return 403 if not admin", async () => {
      const res = await request(app)
        .put(`/api/admin/users/0`)
        .set("Cookie", `token=${userToken}`)
        .send({});
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Forbidden" });
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    it("should delete a user", async () => {
      const user = await createStandardUser();
      const res = await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`);

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
        .set("Cookie", `token=${adminToken}`);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "User not found" });
    });

    it("should return 410 if user already deleted", async () => {
      const user = await createStandardUser();
      await createStandardUser();
      await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`);
      const res = await request(app)
        .delete(`/api/admin/users/${user.user_id}`)
        .set("Cookie", `token=${adminToken}`);
      expect(res.status).toBe(410);
      expect(res.body).toMatchObject({ message: "User already deleted" });
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).delete(`/api/admin/users/0`);
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });

    it("should return 403 if not admin", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/0`)
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Forbidden" });
    });
  });
});
