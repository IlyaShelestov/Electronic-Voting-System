const request = require("supertest");
const server = require("../../src/index");
const pool = require("../../src/config/db");

describe("Auth API Tests", () => {
    beforeAll(async () => {
        await pool.query(`SELECT 1`);
    })

    afterAll(async () => {
        try {
            await pool.query("DELETE FROM users WHERE iin = $1", ["123456789012"]);
            await pool.end();
            server.close();
        } catch (err) {
            console.log("Error during cleanup:", err);
            throw err;
        }
    })

    test('Should register a user', async () => {
        const res = await request(server).post('/api/auth/register').send({
            iin: '123456789012',
            name: 'TestName',
            surname: 'TestSurname',
            patronymic: 'TestPatronymic',
            nationality: 'TestNationality',
            birth_date: '2021-01-01',
            region: 'TestRegion',
            city: 'TestCity',
            address: 'TestAddress',
            sex: 'TestSex',
            email: "test@test.com",
            phone: '1234567890',
            password: "testpassword",
            role: "user",
        })

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty('iin', '123456789012');
    })
})