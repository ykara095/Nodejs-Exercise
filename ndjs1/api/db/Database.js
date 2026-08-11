const { Pool } = require('pg');

let sharedPool = null; // Havuzu (pool) modül seviyesinde tutuyoruz

class Database {

    constructor() {
        // Constructor içinde return kullanmıyoruz, aksi takdirde kalıtım (inheritance) bozulur!
    }

    // this.pool çağrıldığında her zaman sharedPool'u döndürür
    get pool() {
        return sharedPool;
    }

    // this.pool = ... denildiğinde sharedPool'u günceller
    set pool(val) {
        sharedPool = val;
    }

    async connect(options) {
        if (sharedPool) return sharedPool;

        sharedPool = new Pool({
            connectionString: options.CONNECTION_STRING
        })

        const client = await sharedPool.connect();
        client.release();

        console.log('PostgreSQL baglantisi basariyla kuruldu.');
        return sharedPool;
    }

}

module.exports = Database;