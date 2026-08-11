var express = require('express');
var router = express.Router();
const Users = require("../db/Users");
const Response = require("../lib/response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");



router.get('/', async (req, res, next) => {

  try {
    let users = await Users.getAll();

    res.json(Response.successResponse(users));
  } catch (error) {
    res.json(Response.errorResponse(error));
  }

})

router.post('/add', async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.email) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "email field must be filled");
    }
    if (!body.passwords) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "passwords field must be filled");
    }

    let result = await Users.add(body.email, body.passwords);

    // Dönen sonucu { user_id: result.id } şeklinde kullanıcıya gösteriyoruz
    res.json(Response.successResponse({ message: "User successfully added!", user_id: result.id }, Enum.HTTP_CODES.CREATED));
  } catch (error) {
    let statusCode = (error instanceof CustomError) ? error.code : Enum.HTTP_CODES.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json(Response.errorResponse(error, statusCode));
  }
})

module.exports = router;
