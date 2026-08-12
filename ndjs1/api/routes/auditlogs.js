const express = require("express");
const Response = require("../lib/response");
const AuditLogs = require("../db/AuditLogs");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // GET isteklerinde veri req.body yerine req.query'den alınır.
        let query = req.query;
        let filters = {};

        if (query.begin_date && query.end_date) {
            filters.begin_date = query.begin_date;
            filters.end_date = query.end_date;
        }

        // Filtreleri getAll metoduna gönderiyoruz
        let auditLogs = await AuditLogs.getAll(filters);

        res.json(Response.successResponse(auditLogs));
    } catch (error) {
        // Hata durumunda kendi Response sınıfımızın errorResponse metodunu kullanıyoruz
        res.status(500).json(Response.errorResponse(error));
    }
});

module.exports = router;