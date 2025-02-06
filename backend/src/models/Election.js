const pool = require ("../config/db");

class Election {
    static async createElection(data) {
        const query = "INSERT INTO elections (title, start_date, end_date, region, city) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const values = [data.title, data.start_date, data.end_date, data.region, data.city];
        
        const result = await pool.query(query, values);
        return result.rows[0];
    } 
}

module.exports = Election;