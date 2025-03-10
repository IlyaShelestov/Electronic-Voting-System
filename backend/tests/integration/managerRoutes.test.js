const request = require("supertest");
const app = require("../../src/index");
const { getManagerToken } = require("../helpers/tokenHelper");
const {
  createElection,
  createEvent,
  createCity,
  createRegion,
} = require("../helpers/entitiesHelper");
const {
  createManager,
  createCandidate,
  createStandardUser,
} = require("../helpers/usersHelper");

describe("Manager Routes Integration Tests", () => {
  let managerToken, election, candidate, event, user;

  beforeAll(async () => {
    await createRegion();
    await createCity();
    const manager = await createManager();
    managerToken = getManagerToken({ userId: manager.user_id });
  });

  beforeEach(async () => {
    await createRegion();
    await createCity();
    election = await createElection();
    candidate = await createCandidate({ election_id: election.election_id });
    user = await createStandardUser();
    event = await createEvent();
  });

  describe("Election Routes", () => {
    it("should create an election", async () => {
      const res = await request(app)
        .post("/api/manager/elections")
        .set("Cookie", `token=${managerToken}`)
        .send({
          title: "New Election",
          start_date: "2025-01-01",
          end_date: "2025-01-10",
          region_id: 1,
          city_id: 1,
        });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("New Election");
    });

    it("should delete an election", async () => {
      const res = await request(app)
        .delete(`/api/manager/elections/${election.election_id}`)
        .set("Cookie", `token=${managerToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe("Candidate Routes", () => {
    it("should create a candidate", async () => {
      const res = await request(app)
        .post("/api/manager/candidates")
        .set("Cookie", `token=${managerToken}`)
        .send({
          user_id: user.user_id,
          election_id: election.election_id,
          bio: "Test Candidate Bio",
          party: "Test Party",
        });
      expect(res.status).toBe(201);
      expect(res.body.bio).toBe("Test Candidate Bio");
    });

    it("should attach a candidate to an election", async () => {
      const res = await request(app)
        .post("/api/manager/candidates/attach")
        .set("Cookie", `token=${managerToken}`)
        .send({
          election_id: election.election_id,
          candidate_id: candidate.candidate_id,
        });
      expect(res.status).toBe(200);
    });

    it("should update a candidate", async () => {
      const res = await request(app)
        .put(`/api/manager/candidates/${candidate.candidate_id}`)
        .set("Cookie", `token=${managerToken}`)
        .send({
          bio: "Updated Candidate Bio",
          party: "Updated Party",
        });
      expect(res.status).toBe(200);
      expect(res.body.bio).toBe("Updated Candidate Bio");
    });

    it("should delete a candidate", async () => {
      const res = await request(app)
        .delete(`/api/manager/candidates/${candidate.candidate_id}`)
        .set("Cookie", `token=${managerToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe("Event Routes", () => {
    it("should create an event", async () => {
      const res = await request(app)
        .post(`/api/manager/events/${event.event_id}`)
        .set("Cookie", `token=${managerToken}`)
        .send({
          title: "Test Event",
          description: "Event Description",
          event_date: "2025-02-15",
        });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Test Event");
    });

    it("should update an event", async () => {
      const res = await request(app)
        .put(`/api/manager/events/${event.event_id}`)
        .set("Cookie", `token=${managerToken}`)
        .send({
          title: "Updated Event Title",
          description: "Updated Description",
          event_date: "2025-02-20",
        });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Event Title");
    });

    it("should delete an event", async () => {
      const res = await request(app)
        .delete(`/api/manager/events/${event.event_id}`)
        .set("Cookie", `token=${managerToken}`);
      expect(res.status).toBe(200);
    });
  });
});
