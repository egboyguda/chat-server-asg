// auth.js
var passport = require("passport");
var passportJWT = require("passport-jwt");
var User = require("../models/user.model");
var cfg = require("../config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
};

module.exports = function () {
  var strategy = new Strategy(params, async function (payload, done) {
    try {
      var user = await User.findById(payload.id);

      if (!user) {
        return done(new Error("UserNotFound"), null);
      } else if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  });

  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
    authenticate: function () {
      return passport.authenticate("jwt", cfg.jwtSession);
    },
  };
};
