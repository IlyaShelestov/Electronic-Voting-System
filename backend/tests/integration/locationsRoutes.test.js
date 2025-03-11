const request = require("supertest");
const app = require("../../src/index");
const { getUserToken } = require("../helpers/tokenHelper");
const { createRegion, createCity } = require("../helpers/entitiesHelper");
describe("Locations API Integration Tests", () => {
  let userToken = "";
  beforeAll(() => {
    userToken = getUserToken();
  });
  beforeEach(async () => {
    await createRegion();
    await createRegion({ name: "TestRegion2" });
    await createCity();
    await createCity({ name: "TestCity2", region_id: 2 });
  });

  describe("GET /api/locations/cities", () => {
    it("should return all cities", async () => {
      const res = await request(app)
        .get("/api/locations/cities")
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            city_id: 1,
            name: "TestCity",
            region_id: 1,
          }),
          expect.objectContaining({
            city_id: 2,
            name: "TestCity2",
            region_id: 2,
          }),
        ])
      );
    });
  });

  describe("GET /api/locations/cities/:id", () => {
    it("should return city by id", async () => {
      const res = await request(app)
        .get("/api/locations/cities/2")
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ city_id: 2, name: "TestCity2", region_id: 2 });
    });
  });

  describe("GET /api/locations/regions", () => {
    it("should return all regions", async () => {
      const res = await request(app)
        .get("/api/locations/regions")
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ region_id: 1, name: "TestRegion" }),
          expect.objectContaining({ region_id: 2, name: "TestRegion2" }),
        ])
      );
    });
  });

  describe("GET /api/locations/regions/:id", () => {
    it("should return region by id", async () => {
      const res = await request(app)
        .get("/api/locations/regions/2")
        .set("Cookie", `token=${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ region_id: 2, name: "TestRegion2" });
    });
  });
});
