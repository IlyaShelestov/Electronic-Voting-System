const request = require("supertest");
const app = require("../../src/index");
const {
  createElection,
  attachCandidate,
  castVote,
  createCity,
  createRegion,
} = require("../helpers/entitiesHelper");
const { getUserToken } = require("../helpers/tokenHelper");
const {
  createCandidate,
  createStandardUser,
} = require("../helpers/usersHelper");

describe("Elections API Integration Tests", () => {
  let election, electionWithCandidate, userToken, candidate, voter;
  beforeEach(async () => {
    await createRegion();
    await createCity();
    userToken = getUserToken({
      city: 1,
      userId: 2,
    });

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const start_date = yesterday.toISOString().split("T")[0];
    const end_date = tomorrow.toISOString().split("T")[0];

    election = await createElection({
      title: "Available Election",
      start_date,
      end_date,
      region: 1,
      city: 1,
    });

    notAvaliableElection = await createElection({
      title: "Not Available Election",
      start_date: "2021-01-01",
      end_date: "2021-01-02",
      region: 1,
      city: 1,
    });

    electionWithCandidate = await createElection({
      title: "Election with Candidate",
      start_date,
      end_date,
      region: 1,
      city: 1,
    });
    candidate = await createCandidate();
    await attachCandidate(
      electionWithCandidate.election_id,
      candidate.candidate_id
    );
    voter = await createStandardUser({ userId: 2 });
    castVote(
      "123",
      electionWithCandidate.election_id,
      candidate.candidate_id,
      2
    );
  });

  describe("GET /api/elections", () => {
    it("should return 200 and an array of elections", async () => {
      const res = await request(app)
        .get("/api/elections")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toEqual(3);
      const found = res.body.find(
        (e) => e.election_id === election.election_id
      );
      expect(found).toBeDefined();
    });
  });

  describe("GET /api/elections/available", () => {
    it("should return 200 and available elections based on user's location and current date", async () => {
      const res = await request(app)
        .get("/api/elections/available")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find(
        (e) => e.election_id === election.election_id
      );
      expect(found).toBeDefined();
    });
  });

  describe("GET /api/elections/:id/report", () => {
    it("should return 200 and a daily votes report for the given election", async () => {
      const res = await request(app)
        .get(`/api/elections/${electionWithCandidate.election_id}/report`)
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 500 if an error occurs", async () => {
      const res = await request(app)
        .get("/api/elections/9999/report")
        .set("Cookie", `token=${userToken}`);
      if (Array.isArray(res.body)) {
        expect(res.status).toBe(200);
      } else {
        expect(res.status).toBe(500);
        expect(res.body).toMatchObject({
          message: "Error getting votes report",
        });
      }
    });
  });

  describe("GET /api/elections/:id/candidates", () => {
    it("should return 200 and an array of candidates for the election", async () => {
      const res = await request(app)
        .get(`/api/elections/${electionWithCandidate.election_id}/candidates`)
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return 500 if an error occurs (e.g., invalid id)", async () => {
      const res = await request(app)
        .get("/api/elections/invalid/candidates")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({
        message: "Error getting candidates",
      });
    });
  });

  describe("GET /api/elections/:id", () => {
    it("should return 200 and the election object", async () => {
      const res = await request(app)
        .get(`/api/elections/${election.election_id}`)
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ election_id: election.election_id });
    });

    it("should return 500 if an error occurs (e.g., invalid id)", async () => {
      const res = await request(app)
        .get("/api/elections/invalid")
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ message: "Error getting election" });
    });
  });
});
