const request = require("supertest");
const app = require("../../src/index");
const { getUserToken, getAdminToken } = require("../helpers/tokenHelper");
const { createStandardUser } = require("../helpers/usersHelper");
const { createRegion, createCity } = require("../helpers/entitiesHelper");

describe("Profile Change Requests API Integration Tests", () => {
  let userToken, adminToken, user;

  beforeEach(async () => {
    await createRegion();
    await createCity();
    user = await createStandardUser();
    userToken = getUserToken({ userId: user.user_id });
    adminToken = getAdminToken();
  });

  describe("User Routes", () => {
    describe("POST /api/users/me/request-change", () => {
      it("should create a profile change request successfully", async () => {
        const requestData = {
          field_name: "email",
          new_value: "newemail@example.com",
        };

        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send(requestData);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Change request submitted successfully");
        expect(res.body.request).toMatchObject({
          user_id: user.user_id,
          field_name: "email",
          old_value: user.email,
          new_value: "newemail@example.com",
          status: "pending",
        });
      });

      it("should return 400 if field_name is missing", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ new_value: "newemail@example.com" });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ message: "Missing required fields" });
      });

      it("should return 400 if new_value is missing", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email" });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ message: "Missing required fields" });
      });

      it("should return 400 if new value is the same as current value", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: user.email });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: "New value is the same as current value",
        });
      });

      it("should return 400 if field name is invalid", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "invalid_field", new_value: "some value" });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ message: "Invalid field name" });
      });

      it("should return 403 if field cannot be changed", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "role", new_value: "admin" });

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
          message: "This field cannot be changed",
        });
      });

      it("should return 400 if email format is invalid", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "invalid-email" });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({ message: "Invalid email format" });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app)
          .post("/api/users/me/request-change")
          .send({ field_name: "email", new_value: "newemail@example.com" });

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });
    });

    describe("GET /api/users/me/requests", () => {
      it("should retrieve user's change requests", async () => {
        await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const res = await request(app)
          .get("/api/users/me/requests")
          .set("Cookie", `token=${userToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toMatchObject({
          user_id: user.user_id,
          field_name: "email",
          new_value: "newemail@example.com",
          status: "pending",
        });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app).get("/api/users/me/requests");

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });
    });
  });

  describe("Admin Routes", () => {
    describe("GET /api/admin/requests", () => {
      it("should return all change requests", async () => {
        await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const res = await request(app)
          .get("/api/admin/requests")
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toMatchObject({
          user_id: user.user_id,
          field_name: "email",
          new_value: "newemail@example.com",
          status: "pending",
          first_name: user.first_name,
          last_name: user.last_name,
          iin: user.iin,
        });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app).get("/api/admin/requests");

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });

      it("should return 403 if not admin", async () => {
        const res = await request(app)
          .get("/api/admin/requests")
          .set("Cookie", `token=${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({ message: "Forbidden" });
      });
    });

    describe("GET /api/admin/requests/:id", () => {
      it("should return a specific change request", async () => {
        const createRes = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const requestId = createRes.body.request.request_id;

        const res = await request(app)
          .get(`/api/admin/requests/${requestId}`)
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
          request_id: requestId,
          user_id: user.user_id,
          field_name: "email",
          new_value: "newemail@example.com",
          status: "pending",
          first_name: user.first_name,
          last_name: user.last_name,
          iin: user.iin,
        });
      });

      it("should return 404 if request not found", async () => {
        const res = await request(app)
          .get("/api/admin/requests/9999")
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ message: "Request not found" });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app).get("/api/admin/requests/1");

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });

      it("should return 403 if not admin", async () => {
        const res = await request(app)
          .get("/api/admin/requests/1")
          .set("Cookie", `token=${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({ message: "Forbidden" });
      });
    });

    describe("POST /api/admin/requests/:id/approve", () => {
      it("should approve a change request and update user data", async () => {
        const createRes = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const requestId = createRes.body.request.request_id;

        const res = await request(app)
          .post(`/api/admin/requests/${requestId}/approve`)
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request approved successfully");
        expect(res.body.request.status).toBe("approved");

        const userRes = await request(app)
          .get("/api/users/me")
          .set("Cookie", `token=${userToken}`);

        expect(userRes.body.email).toBe("newemail@example.com");
      });

      it("should return 404 if request not found", async () => {
        const res = await request(app)
          .post("/api/admin/requests/9999/approve")
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ message: "Request not found" });
      });

      it("should return 400 if request already processed", async () => {
        const createRes = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const requestId = createRes.body.request.request_id;

        await request(app)
          .post(`/api/admin/requests/${requestId}/approve`)
          .set("Cookie", `token=${adminToken}`);

        const res = await request(app)
          .post(`/api/admin/requests/${requestId}/approve`)
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: "Request already processed",
        });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app).post("/api/admin/requests/1/approve");

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });

      it("should return 403 if not admin", async () => {
        const res = await request(app)
          .post("/api/admin/requests/1/approve")
          .set("Cookie", `token=${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({ message: "Forbidden" });
      });
    });

    describe("POST /api/admin/requests/:id/reject", () => {
      it("should reject a change request", async () => {
        const createRes = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const requestId = createRes.body.request.request_id;

        const res = await request(app)
          .post(`/api/admin/requests/${requestId}/reject`)
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Request rejected successfully");
        expect(res.body.request.status).toBe("rejected");

        const userRes = await request(app)
          .get("/api/users/me")
          .set("Cookie", `token=${userToken}`);

        expect(userRes.body.email).toBe(user.email);
      });

      it("should return 404 if request not found", async () => {
        const res = await request(app)
          .post("/api/admin/requests/9999/reject")
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ message: "Request not found" });
      });

      it("should return 400 if request already processed", async () => {
        const createRes = await request(app)
          .post("/api/users/me/request-change")
          .set("Cookie", `token=${userToken}`)
          .send({ field_name: "email", new_value: "newemail@example.com" });

        const requestId = createRes.body.request.request_id;

        await request(app)
          .post(`/api/admin/requests/${requestId}/reject`)
          .set("Cookie", `token=${adminToken}`);

        const res = await request(app)
          .post(`/api/admin/requests/${requestId}/reject`)
          .set("Cookie", `token=${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          message: "Request already processed",
        });
      });

      it("should return 401 if not authenticated", async () => {
        const res = await request(app).post("/api/admin/requests/1/reject");

        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ message: "Unauthorized" });
      });

      it("should return 403 if not admin", async () => {
        const res = await request(app)
          .post("/api/admin/requests/1/reject")
          .set("Cookie", `token=${userToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({ message: "Forbidden" });
      });
    });
  });
});
