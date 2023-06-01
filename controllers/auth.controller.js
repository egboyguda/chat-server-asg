const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");

// Configure the passport-local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user || !(await user.isValidPassword(password))) {
        return done(null, false, { message: "Invalid username or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Generate JWT token
function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.username,
    // Add additional payload data as needed
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    const token = generateToken(user);

    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = function (req, res, next) {
  console.log(req.body);
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Authentication failed" });
    }

    const token = generateToken(user);

    res.json({ token, userId: user._id, username: user.username });
  })(req, res, next);
};
