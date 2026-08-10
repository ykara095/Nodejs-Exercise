const { Pool } = require('pg');

let instance = null;
class Database {

    constructor() {
        if (!instance) {
            this.pool = null; //yeni olusturulan database = null;
            instance = this;
        }

        return instance;
    }

    async connect(options) {
        if (this.pool) return this.pool;

        this.pool = new Pool({
            connectionString: options.CONNECTION_STRING
        })

        const client = await this.pool.connect();
        client.release();

        console.log('PostgreSQL baglantisi basariyla kuruldu.');
        return this.pool;
    }

}

module.exports = Database