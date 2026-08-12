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
        // RETURNING id sayesinde PostgreSQL eklediği verinin ID'sini bize geri dönecek
        const query = "INSERT INTO users (email,passwords) VALUES ($1,$2) RETURNING id";

        try {
            const result = await this.pool.query(query, [email, passwords]);
            return result.rows[0]; // Bize { id: 5 } şeklinde objeyi döner
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    /*async updateEmail(id, email) {
        const query = "UPDATE users SET email = $2 WHERE id = $1";
        try {
            const result = await this.pool.query(query, [id, email]);
            return result.rowCount;
        }
        catch (error) {
            console.error("verileri guncellerken hata olustu", error);
            throw error;
        }
    }*/

    async update(id, updates) {
        let setQuery = [];
        let values = [];
        let count = 1;
        if (updates.email) {
            setQuery.push(`email = $${count}`);
            values.push(updates.email)
            count++;
        }
        if (updates.passwords) {
            setQuery.push(`passwords = $${count}`);
            values.push(updates.passwords);
            count++;
        }
        if (setQuery.length === 0) return;
        values.push(id);

        const query = "UPDATE users SET " + setQuery.join(", ") + " WHERE id =$" + `${count}`;

        try {
            const result = await this.pool.query(query, values);
            return result.rowCount;
        }

        catch (error) {
            console.error("verileri guncellerken hata olustu", error);
            throw error;
        }

    }

    async delete(id) {
        const query = "DELETE FROM users WHERE id=$1";

        try {
            const result = await this.pool.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.error("verileri silerken hata olustu", error);
            throw error;
        }
    }
}

module.exports = new Users();
