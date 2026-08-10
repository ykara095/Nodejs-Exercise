const Database = require('./Database');

class userDetails extends Database {
    constructor() {
        super();
    }

    async getAll() {
        const query = "SELECT * FROM user_details";

        try {
            const result = await this.pool.query(query);
            return result.rows;
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    async getByUserId(user_id) {
        const query = "SELECT * FROM user_details WHERE user_id = $1";

        try {
            const result = await this.pool.query(query, [user_id]);
            return result.rows[0];
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    async add(first_name, last_name, avatar_url, phone_number) {
        const query = "INSERT INTO user_details (first_name,last_name,avatar_url,phone_number) VALUES ($1,$2,$3,$4)";

        try {
            const result = await this.pool.query(query, [first_name, last_name, avatar_url, phone_number]);
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }
}

module.exports = userDetails;