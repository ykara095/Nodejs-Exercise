const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/Users");
const UserDetails = require("../db/UserDetails");
const CustomError = require("./Error");
const Enum = require("../config/Enum");
const Response = require("./response");



const config = require("../config");

module.exports = function () {
    let strategy = new Strategy({
        // secretOrKey: Gelen token'ın orijinalliğini ve değiştirilmediğini doğrulamak için kullanılan gizli anahtar (mühür).
        secretOrKey: config.JWT.SECRET,
        // jwtFromRequest: İstekte token'ın nerede aranacağını belirtir (Authorization header'ı içinde 'Bearer' kelimesinden sonra).
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        // payload: Token içinden çıkan veriler (örn: giriş yapanın id'si)
        try {
            let user = await Users.getById(payload.id);

            if (user) {
                let userDetails = await UserDetails.getByUserId(user.id);

                // Spread (...) ile iki objeyi birleştirip tek obje yapıyoruz.
                // done(null, sonuc): İşlem bitti, hata yok, al bu da kullanıcı verisi demek.
                done(null, { ...user, ...userDetails });
            } else {
                done(null, false);
            }
        } catch (error) {
            // try-catch: Veritabanı hatalarında sunucu çökmesin diye kullanırız.
            done(error, false);
        }
    });

    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false });
        },
        checkRoles: function (...expectedRoles) {
            return (req, res, next) => {
                if (!expectedRoles.includes(req.user.role)) {
                    let error = new CustomError(Enum.HTTP_CODES.FORBIDDEN, "auth error", "role doesn't have auth");
                    return res.status(error.code).json(Response.errorResponse(error));
                }

                next();
            }
        }
    };
}