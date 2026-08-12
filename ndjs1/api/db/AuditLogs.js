const Database = require('./Database');

// AuditLogs sınıfı, Database sınıfından miras alır (inheritance).
// Bu sayede Database.js içindeki veritabanı bağlantı havuzunu (this.pool) doğrudan kullanabiliriz.
class AuditLogs extends Database {
    constructor() {
        // super() anahtar kelimesi, miras aldığımız Database sınıfının constructor'ını çalıştırır.
        super();
    }

    // Veritabanındaki denetim günlüklerini (audit logs) getiren metod.
    // Opsiyonel olarak tarih filtreleri (begin_date, end_date) alabilir.
    async getAll(filters = {}) {
        let query = "SELECT * FROM audit_logs";
        let values = [];

        // Eğer başlangıç ve bitiş tarihi verilmişse SQL sorgusuna WHERE şartı ekliyoruz
        if (filters.begin_date && filters.end_date) {
            query += " WHERE created_at >= $1 AND created_at <= $2";
            values.push(filters.begin_date, filters.end_date);
        }

        try {
            // this.pool.query ile sorguyu çalıştırıyoruz, values dizisini parametre olarak yolluyoruz.
            const result = await this.pool.query(query, values);
            return result.rows; 
        } catch (error) {
            console.error("Audit loglarini cekerken hata olustu:", error);
            throw error;
        }
    }

    // Sadece belirli bir ID'ye sahip olan log kaydını getiren metod.
    async getById(id) {
        // $1 ifadesi, SQL Injection (saldırı) açıklarını önlemek için kullanılan parametrik sorgu yapısıdır.
        const query = "SELECT * FROM audit_logs WHERE id = $1";

        try {
            // [id] dizisi içindeki değer sırasıyla query'deki $1 yerine geçer.
            const result = await this.pool.query(query, [id]);
            // ID benzersiz (unique) olduğu için bize tek bir satır dönecektir, bu yüzden ilk elemanı (0) alıyoruz.
            return result.rows[0];
        } catch (error) {
            console.error("Audit log cekerken hata olustu:", error);
            throw error;
        }
    }

    // Yeni bir log kaydı oluşturmak (eklemek) için kullanılan metod.
    // İhtiyacınıza göre parametreleri (email, location vb.) değiştirebilirsiniz.
    async add(level, email, location, proc_type, log) {
        // INSERT INTO ile veritabanına veri ekleriz.
        // RETURNING id komutu, veri başarıyla eklendikten sonra oluşturulan yeni satırın ID değerini bize geri verir.
        const query = "INSERT INTO audit_logs (level, email, location, proc_type, log) VALUES ($1, $2, $3, $4, $5) RETURNING id";

        try {
            // Parametreler sırasıyla $1, $2, $3, $4, $5 yerlerine yerleştirilir.
            const result = await this.pool.query(query, [level, email, location, proc_type, log]);
            return result.rows[0]; // Bize { id: 5 } şeklinde objeyi döner.
        } catch (error) {
            console.error("Audit log eklerken hata olustu:", error);
            throw error;
        }
    }
    
    // Not: Log verileri genellikle değiştirilmez (update) veya silinmez (delete) ki geçmiş kayıtlar güvenilir kalsın.
    // Ancak eğer bu bir alıştırma ise ve CRUD'un tüm fonksiyonlarını eklemek isterseniz,
    // Users.js içindeki gibi update ve delete metodlarını da buraya ekleyebilirsiniz.
}

// Dosya başka bir yerde (örneğin routes içinde) 'require' edildiğinde, doğrudan bu sınıftan oluşturulmuş
// hazır bir nesneyi (instance) versin diye 'new AuditLogs()' şeklinde export ediyoruz.
module.exports = new AuditLogs();
