const Database = require('./Database');

class Users extends Database {
    constructor() {
        super();
    }

    async getAll() {
        const query = "SELECT id,email,passwords FROM users";

        try {
            const result = await this.pool.query(query);
            return result.rows;
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    async getById(id) {
        const query = "SELECT * FROM users WHERE id = $1"

        try {
            const result = await this.pool.query(query, [id]);
            return result.rows[0];
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    async add(email, passwords) {
        const query = "INSERT INTO users (email,passwords) VALUES ($1,$2)";

        try {
            const result = await this.pool.query(query, [email, passwords]);
            return result.rows;
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }
}

module.exports = Users;

