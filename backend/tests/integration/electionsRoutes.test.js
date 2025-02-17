const request = require("supertest");
const app = require("../../src/index");
const {
  createElection,
  attachCandidate,
  castVote,
} = require("../helpers/entitiesHelper");
const { getUserToken } = require("../helpers/tokenHelper");

describe("Elections API Integration Tests", () => {
  describe("GET /api/elections", () => {});

  describe("GET /api/elections/locations", () => {});

  describe("GET /api/elections/avaliable", () => {});

  describe("GET /api/elections/:id/report", () => {});

  describe("GET /api/elections/:id/candidates", () => {});

  describe("GET /api/elections/:id", () => {});
});
