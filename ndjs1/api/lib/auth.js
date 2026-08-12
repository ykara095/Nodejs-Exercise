const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const Users = require("../db/Users");
const UserDetails = require("../db/UserDetails");

const config = require("../config");

module.exports = function () {
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
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
        }
    };
}