var express = require('express');
var router = express.Router();
const Users = require("../db/Users");
const Response = require("../lib/response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require('../lib/AuditLogs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const auth = require('../lib/auth')();



router.get('/', auth.authenticate(), async (req, res, next) => {

  try {
    let users = await Users.getAll();

    // Basarili bir sekilde tum kullanicilar cekilirse bunu sisteme logluyoruz
    AuditLogs.info(req.user?.email, "Users", "Get", "All users fetched");

    res.json(Response.successResponse(users));
  } catch (error) {
    // Islem sirasinda bir hata cikarsa bunu error seviyesinde logluyoruz
    AuditLogs.error(req.user?.email, "Users", "Get", error.message);
    res.json(Response.errorResponse(error));
  }

})

router.post('/add', async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.email) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("EMAIL_REQUIRED"));
    }
    if (!body.passwords) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("PASSWORD_REQUIRED"));
    }

    let hashedPasswords = await bcrypt.hash(body.passwords, 10);

    let result = await Users.add(body.email, hashedPasswords);

    // Yeni kullanici eklendiginde, bunu yapan kisiyi ve islemi logluyoruz
    AuditLogs.info(req.user?.email, "Users", "Add", "Added");

    // Dönen sonucu { user_id: result.id } şeklinde kullanıcıya gösteriyoruz
    res.json(Response.successResponse({ message: "User successfully added!", user_id: result.id }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    // Ekleme esnasinda bir problem veya validasyon hatasi cikarsa error olarak kaydediyoruz
    AuditLogs.error(req.user?.email, "Users", "Add", error.message);

    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));
  }
})

router.put('/update', auth.authenticate(), async (req, res, next) => {
  let body = req.body;
  try {
    let updates = {}

    if (!body.id) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("ID_REQUIRED"));
    }

    if (body.email) updates.email = body.email;
    if (body.passwords) updates.passwords = body.passwords;

    await Users.update(body.id, updates);

    // Guncelleme islemi bittiginde log atiyoruz
    AuditLogs.info(req.user?.email, "Users", "Update", "User updated");

    res.json(Response.successResponse({ message: "User successfully updated!" }));

  } catch (error) {
    // Guncelleme sirasinda hata olursa logluyoruz
    AuditLogs.error(req.user?.email, "Users", "Update", error.message);

    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));
  }
})

router.delete('/delete', auth.authenticate(), auth.checkRoles("ADMIN"), async (req, res, next) => {
  let body = req.body;

  try {
    if (!body.id) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("ID_REQUIRED"));
    }
    await Users.delete(body.id);

    // Silme islemini gerceklestiren kisiyi logluyoruz
    AuditLogs.info(req.user?.email, "Users", "Delete", "User deleted");

    res.json(Response.successResponse({ message: "User successfully deleted!" }));
  } catch (error) {
    // Silme isleminde hata alinirsa kaydediyoruz
    AuditLogs.error(req.user?.email, "Users", "Delete", error.message);

    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));

  }


})

router.post('/login', async (req, res, next) => {
  let body = req.body;

  try {

    if (!body.email) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("EMAIL_REQUIRED"));
    }

    if (!body.passwords) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("PASSWORD_REQUIRED"));
    }
    let results = await Users.getByEmail(body.email);

    if (!results) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("USER_NOT_FOUND"));
    } else {
      let isPasswordsCorrect = await bcrypt.compare(body.passwords, results.passwords)
      if (!isPasswordsCorrect) {
        throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("INVALID_CREDENTIALS"));

      } else {
        let accessToken = jwt.sign({ id: results.id }, config.JWT.SECRET, { expiresIn: '1h' });
        let refreshToken = jwt.sign({ id: results.id }, config.JWT.SECRET, { expiresIn: '7d' })
        res.json(Response.successResponse({ accessToken: accessToken, refreshtoken: refreshToken }));
      }
    }

  } catch (error) {
    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));
  }
})

router.post('/refresh', async (req, res, next) => {
  let body = req.body;

  try {

    if (!body.refreshtoken) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, req.__("VALIDATION_ERROR"), req.__("REFRESH_TOKEN_REQUIRED"));
    }

    let payload = jwt.verify(body.refreshtoken, config.JWT.SECRET);

    let newAccessToken = jwt.sign({
      id: payload.id
    }, config.JWT.SECRET, { expiresIn: '1h' })

    res.json(Response.successResponse({ accessToken: newAccessToken }));

  } catch (error) {
    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));
  }

})

module.exports = router;
