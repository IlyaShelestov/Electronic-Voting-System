const request = require("supertest");
const app = require("../../src/index");
const User = require("../../src/models/User");

describe("Auth API Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user and return user data", async () => {
      const newUser = {
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        region: "TestRegion",
        city: "TestCity",
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "TestPassword",
      };

      const res = await request(app).post("/api/auth/register").send(newUser);

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
        role: "user",
      });
      expect(res.body).toHaveProperty("user_id");
      expect(res.body).toHaveProperty("password_hash");
      expect(res.body).toHaveProperty("created_at");
      expect(res.body).toHaveProperty("updated_at");
    });

    it("should return 409 if user already exists", async () => {
      const existingUser = {
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        region: "TestRegion",
        city: "TestCity",
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "TestPassword",
      };

      await request(app).post("/api/auth/register").send(existingUser);
      const res = await request(app)
        .post("/api/auth/register")
        .send(existingUser);

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({ message: "User with this IIN already exists" });
    });

    it("should return 403 if already logged in", async () => {
      const newUser = {
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        region: "TestRegion",
        city: "TestCity",
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "TestPassword",
      };

      await request(app).post("/api/auth/register").send(newUser);

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ iin: newUser.iin, password: newUser.password });
      const token = loginRes.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];

      const res = await request(app)
        .post("/api/auth/register")
        .set("Cookie", `token=${token}`)
        .send(newUser);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Already logged in" });
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        region: "TestRegion",
        city: "TestCity",
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "TestPassword",
      });
    });

    it("should login a user, set a cookie and return a message", async () => {
      const res = await request(app).post("/api/auth/login").send({
        iin: "123456789012",
        password: "TestPassword",
      });

      const token = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ message: "Logged in" });
      expect(token).toBeDefined();
    });

    it("should return 401 if invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        iin: "123456789012",
        password: "InvalidPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Invalid credentials" });
    });

    it("should return 401 if user not found", async () => {
      const res = await request(app).post("/api/auth/login").send({
        iin: "InvalidIIN",
        password: "TestPassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Invalid credentials" });
    });

    it("should return 401 if missing credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Invalid credentials" });
    });

    it("should return 500 if error logging in", async () => {
      jest.spyOn(User, "findByIIN").mockImplementation(() => {
        throw new Error("Simulated DB failure");
      });

      const res = await request(app).post("/api/auth/login").send({
        iin: "123456789012",
        password: "TestPassword",
      });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ message: "Error logging in" });

      User.findByIIN.mockRestore();
    });

    it("should return 403 if user already logged in", async () => {
      const loginRes = await request(app).post("/api/auth/login").send({
        iin: "123456789012",
        password: "TestPassword",
      });
      const token = loginRes.headers["set-cookie"][0]
        .split(";")[0]
        .split("=")[1];
      const res = await request(app)
        .post("/api/auth/login")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ message: "Already logged in" });
    });
  });

  describe("POST /api/auth/logout", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        iin: "123456789012",
        first_name: "Олег",
        last_name: "Олегов",
        patronymic: "Олегович",
        date_of_birth: "2021-01-01",
        region: "TestRegion",
        city: "TestCity",
        phone_number: "87071234567",
        email: "testemail@gmail.com",
        password: "TestPassword",
      });

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ iin: "123456789012", password: "TestPassword" });

      token = loginRes.headers["set-cookie"][0].split(";")[0].split("=")[1];
    });

    it("should logout a user and clear the token cookie", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", `token=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ message: "Logged out" });

      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      const tokenCookieCleared = cookies.some(
        (cookie) => cookie.includes("token=;") && cookie.includes("Expires=")
      );
      expect(tokenCookieCleared).toBe(true);
    });

    it("should return 401 if no token cookie", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });
});
