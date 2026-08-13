const express = require("express");
const router = express.Router();
const UserDetails = require("../db/UserDetails");
const Response = require("../lib/response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require("../lib/AuditLogs")

/*router.get("/:id", (req, res, next) => {
    res.json({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers

    })
})*/

router.get('/', async (req, res, next) => {

    try {
        let userdetails = await UserDetails.getAll();
        
        // Detaylari cekerken basarili olunursa logluyoruz
        AuditLogs.info(req.user?.email, "UserDetails", "Get", "All user details fetched");

        res.json(Response.successResponse(userdetails));
    } catch (error) {
        // Verileri cekerken hata alirsak error logu atiyoruz
        AuditLogs.error(req.user?.email, "UserDetails", "Get", error.message);
        res.json(Response.errorResponse(error));
    }

})

router.post('/add', async (req, res, next) => {
    let body = req.body;
    try {
        if (!body.user_id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("USER_ID_REQUIRED"));
        }


        if (!body.first_name) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("FIRST_NAME_REQUIRED"));
        }



        let result = await UserDetails.add(body.user_id, body.first_name, body.last_name, body.avatar_url, body.phone_number);

        // Yeni kullanici detayi eklendiginde islemi yapan kisiyi logluyoruz
        AuditLogs.info(req.user?.email, "UserDetails", "Add", "Added");

        res.json(Response.successResponse({ message: "User details successfully added!" }, Enum.HTTP_CODES.CREATED));
    } catch (error) {
        // Kullanici detayi eklerken cikan hatalari yakaliyoruz
        AuditLogs.error(req.user?.email, "UserDetails", "Add", error.message);

        let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json(Response.errorResponse(error, statusCode));
    }
})

router.put('/update', async (req, res, next) => {
    let body = req.body;

    try {
        let updates = {};

        if (!body.user_id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("USER_ID_REQUIRED"));
        }

        if (body.first_name) updates.first_name = body.first_name;

        if (body.last_name) updates.last_name = body.last_name;

        if (body.avatar_url) updates.avatar_url = body.avatar_url;

        if (body.phone_number) updates.phone_number = body.phone_number;

        await UserDetails.update(body.user_id, updates);
        
        // Guncelleme basariyla tamamlandiginda logluyoruz
        AuditLogs.info(req.user?.email, "UserDetails", "Update", "User details updated");

        res.json(Response.successResponse({ message: "User details successfully updated!" }));

    } catch (error) {
        // Guncelleme asamasinda cikan hatalari kaydediyoruz
        AuditLogs.error(req.user?.email, "UserDetails", "Update", error.message);

        let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json(Response.errorResponse(error, statusCode));
    }
})

router.delete('/delete', async (req, res, next) => {
    let body = req.body;

    try {
        if (!body.user_id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("ID_REQUIRED"));
        }
        await UserDetails.delete(body.user_id);
        
        // Silme islemini kimin yaptigini ve basarili oldugunu logluyoruz
        AuditLogs.info(req.user?.email, "UserDetails", "Delete", "User details deleted");

        res.json(Response.successResponse({ message: "User details successfully deleted!" }));
    } catch (error) {
        // Silme isleminde hata olursa bunu da sisteme isliyoruz
        AuditLogs.error(req.user?.email, "UserDetails", "Delete", error.message);

        let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
        res.status(statusCode).json(Response.errorResponse(error, statusCode));

    }


})

module.exports = router;