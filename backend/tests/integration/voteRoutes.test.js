const request = require("supertest");
const app = require("../../src/index");
const {
  createCandidate,
  createStandardUser,
} = require("../helpers/usersHelper");
const { getUserToken } = require("../helpers/tokenHelper");
const {
  createElection,
  attachCandidate,
} = require("../helpers/entitiesHelper");
const { create } = require("../../src/models/User");

describe("Vote API Integration Tests", () => {
  let userToken;
  let wrongLocationToken;
  let election;
  let candidate;
  let attachedCandidate;
  beforeEach(async () => {
    userToken = getUserToken({
      region: "TestRegion",
      city: "TestCity",
      userId: 2,
    });
    wrongLocationToken = getUserToken({
      region: "WrongRegion",
      city: "WrongCity",
      userId: 2,
    });
    candidateToken = getUserToken({
      region: "TestRegion",
      city: "TestCity",
      userId: 1,
    });
    election = await createElection({ region: "TestRegion", city: "TestCity" });
    candidate = await createCandidate();
    voter = await createStandardUser();
    attachedCandidate = await attachCandidate(
      election.election_id,
      candidate.candidate_id
    );
  });

  describe("GET api/vote/status/:electionId", () => {
    it("should return 200 and empty string if user is not voted", async () => {
      const res = await request(app)
        .get(`/api/vote/status/${election.election_id}`)
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual("");
    });

    it("should return 200 and body with vote data if user is voted", async () => {
      const res1 = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${userToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      const res2 = await request(app)
        .get(`/api/vote/status/${election.election_id}`)
        .set("Cookie", `token=${userToken}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toMatchObject({ user_id: 2, election_id: 1 });
    });

    it("should return 401 if user is not authorized", async () => {
      const res = await request(app).get("/api/vote/status/1");
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });

  describe("GET api/vote/location/:electionId", () => {
    it("should return 200 and election object if user can vote in this election", async () => {
      const res = await request(app)
        .get(`/api/vote/location/${election.election_id}`)
        .set("Cookie", `token=${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        ...election,
        created_at: expect.any(String),
        start_date: expect.any(String),
        end_date: expect.any(String),
      });
    });

    it("should return 200 and empty string if user cannot vote in this election", async () => {
      const res = await request(app)
        .get(`/api/vote/location/${election.election_id}`)
        .set("Cookie", `token=${wrongLocationToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual("");
    });

    it("should return 401 if user is not authorized", async () => {
      const res = await request(app).get("/api/vote/location/1");
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });

  describe("POST api/vote/cast", () => {
    it("should return 201 if user is authorized", async () => {
      const res = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${userToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(expect.any(String));
    });

    it("should return 409 if user tries to vote for himself", async () => {
      const res = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${candidateToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        message: "User cannot vote for himself",
      });
    });

    it("should return 409 if user has already voted", async () => {
      const res1 = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${userToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      const res2 = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${userToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      expect(res2.status).toBe(409);
      expect(res2.body).toMatchObject({ message: "User has already voted" });
    });

    it("should return 403 if user cannot vote in this election", async () => {
      const res = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${wrongLocationToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({
        message: "User cannot vote in this election",
      });
    });

    it("should return 401 if user is not authorized", async () => {
      const res = await request(app).post("/api/vote/cast").send({});
      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });

  describe("POST api/vote/token", () => {
    it("should return 200 and vote information if token is valid", async () => {
      const res = await request(app)
        .post("/api/vote/cast")
        .set("Cookie", `token=${userToken}`)
        .send({
          electionId: election.election_id,
          candidateId: candidate.candidate_id,
        });
      const token = res.body;
      const res2 = await request(app)
        .post("/api/vote/token")
        .set("Cookie", `token=${userToken}`)
        .send({ token: token });

      expect(res2.status).toBe(200);
      expect(res2.body).toEqual({
        candidate_id: 1,
        election_id: 1,
        token: token,
        vote_id: 1,
        voted_at: expect.any(String),
      });
    });

    it("should return 404 if token is not found", async () => {
      const res = await request(app)
        .post("/api/vote/token")
        .set("Cookie", `token=${userToken}`)
        .send({ token: "invalidToken" });

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ message: "Token not found" });
    });

    it("should return 401 if user is not authorized", async () => {
      const res = await request(app).post("/api/vote/token").send({});

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: "Unauthorized" });
    });
  });
});
