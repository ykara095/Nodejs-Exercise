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

    async add(user_id, first_name, last_name, avatar_url, phone_number) {
        // user_id parametresini query'ye ve VALUES array'ine dahil ettik
        const query = "INSERT INTO user_details (user_id, first_name, last_name, avatar_url, phone_number) VALUES ($1,$2,$3,$4,$5)";

        try {
            const result = await this.pool.query(query, [user_id, first_name, last_name, avatar_url, phone_number]);
        }

        catch (error) {
            console.error("verileri cekerken hata olustu", error);
            throw error;
        }
    }

    async update(id, updates) {
        let setQuery = [];
        let values = [];
        let count = 1;

        if (updates.first_name) {
            setQuery.push(`first_name = $${count}`);
            values.push(updates.first_name); // DÜZELTİLDİ: email yerine first_name
            count++;
        }

        if (updates.last_name) {
            setQuery.push(`last_name = $${count}`);
            values.push(updates.last_name);
            count++;
        }

        if (updates.avatar_url) {
            setQuery.push(`avatar_url = $${count}`);
            values.push(updates.avatar_url);
            count++;
        }

        if (updates.phone_number) {
            setQuery.push(`phone_number = $${count}`);
            values.push(updates.phone_number); // DÜZELTİLDİ: passwords yerine phone_number
            count++;
        }
        if (setQuery.length === 0) return;
        values.push(id);

        // DÜZELTİLDİ: Tablo adı users yerine user_details yapıldı
        const query = "UPDATE user_details SET " + setQuery.join(", ") + " WHERE id =$" + `${count}`;

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
        // DÜZELTİLDİ: Tablo adı users yerine user_details yapıldı
        const query = "DELETE FROM user_details WHERE id=$1";

        try {
            const result = await this.pool.query(query, [id]);
            return result.rowCount;
        } catch (error) {
            console.error("verileri silerken hata olustu", error);
            throw error;
        }
    }
}

module.exports = new userDetails();