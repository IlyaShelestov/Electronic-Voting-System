const request = require("supertest");
const { getUserToken } = require("../helpers/tokenHelper");
const { createStandardUser } = require("../helpers/usersHelper");
const { createCity, createRegion } = require("../helpers/entitiesHelper");
const app = require("../../src/index");

describe("Users API Integration Tests", () => {
  describe("GET /api/users/me", () => {
    it("should return user profile info", async () => {
      await createRegion();
      await createCity();
      const user = await createStandardUser();
      const userToken = getUserToken({ userId: user.user_id, role: user.role });
      const res = await request(app)
        .get("/api/users/me")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      delete user.password_hash;
      expect(res.body).toMatchObject({
        ...user,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });

    it("should return 401 if not logged in", async () => {
      const res = await request(app).get(`/api/users/me`);
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });
});
