const request = require("supertest");
const { getUserToken } = require("../helpers/tokenHelper");
const { createEvent } = require("../helpers/entitiesHelper");
const app = require("../../src/index");

describe("Events API Integration Tests", () => {
  let userToken;
  beforeAll(async () => {
    userToken = getUserToken();
  });

  describe("GET /api/events", () => {
    it("should return a list of events", async () => {
      const event1 = await createEvent();
      const event2 = await createEvent();
      const res = await request(app)
        .get("/api/events")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...event1,
          }),
          expect.objectContaining({
            ...event2,
          }),
        ])
      );
    });
  });
});
