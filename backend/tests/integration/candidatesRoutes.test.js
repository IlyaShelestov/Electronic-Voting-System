const request = require("supertest");
const app = require("../../src/index");
const { createCandidate } = require("../helpers/usersHelper");
const { createCity, createRegion } = require("../helpers/entitiesHelper");
const { getUserToken } = require("../helpers/tokenHelper");

describe("Candidates API Integration Tests", () => {
  let userToken;
  beforeAll(() => {
    userToken = getUserToken();
  });
  beforeEach(async () => {
    await createRegion();
    await createCity();
  });

  describe("GET /candidates", () => {
    it("should return a list of candidates", async () => {
      const candidate1 = await createCandidate();
      const candidate2 = await createCandidate();
      const res = await request(app)
        .get("/api/candidates")
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...candidate1,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            ...candidate2,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("GET /candidates/:id", () => {
    it("should return a candidate by id", async () => {
      const candidate = await createCandidate();
      const res = await request(app)
        .get(`/api/candidates/${candidate.candidate_id}`)
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...candidate,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    });
  });
});
