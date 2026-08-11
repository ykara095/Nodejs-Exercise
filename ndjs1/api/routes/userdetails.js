const express = require("express");
const router = express.Router();
const UserDetails = require("../db/UserDetails");
const Response = require("../lib/response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

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

        res.json(Response.successResponse(userdetails));
    } catch (error) {
        res.json(Response.errorResponse(error));
    }

})

router.post('/add', async (req, res, next) => {
    let body = req.body;
    try {
        // user_id zorunlu
        if (!body.user_id) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "user_id field must be filled");
        }

        // Veritabanı "first_name" beklediği için validation'ı ona göre güncelledik
        if (!body.first_name) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "first_name field must be filled");
        }

        // db/UserDetails.js içindeki add fonksiyonunu body'den gelen verilerle çağırıyoruz
        await UserDetails.add(body.user_id, body.first_name, body.last_name, body.avatar_url, body.phone_number);

        // Başarılı olursa 200 OK ve mesaj döndürüyoruz
        res.json(Response.successResponse({ message: "User successfully added!" }, Enum.HTTP_CODES.CREATED));
    } catch (error) {
        // Eğer PostgreSQL veya başka bir modülden hata gelirse onların error.code yapısı metin (string) olabilir.
        // Bu durum "Invalid status code" hatasına (Express js çöker) yol açar.
        // O yüzden hatanın bizim CustomError olup olmadığını kontrol ediyoruz:
        let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
        
        // Hata durumunda Response sınıfımızı kullanarak JSON formatında cevap dönüyoruz
        res.status(statusCode).json(Response.errorResponse(error, statusCode));
    }
})

module.exports = router;