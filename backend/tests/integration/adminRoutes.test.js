const request = require("supertest");
const { getAdminToken } = require("../helpers/jwtTokens");
// const app = require("../../src/index");

describe("Admin API Integration Tests", () => {
    beforeAll(async () => {
        token = getAdminToken();
    })

    // describe("GET /api/admin/users", () => {

    // })

    // describe("POST /api/admin/users", () => {

    // });

    // describe("PUT /api/admin/users/:id", () => {

    // })

    // describe("DELETE /api/admin/users/:id", () => {

    // })
})