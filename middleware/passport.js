const { users } = require('../models');
const { to } = require('../services/util.service');
const CONFIG = require('../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        let err, user;
        [err, user] = await to(users.findOne({ where: { id: jwt_payload.user_id } }));
        if (err) return done(err, false);
        if (!user) return done(null, false);
        return done(null, user);
    }));
};
