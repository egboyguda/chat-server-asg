const express = require("express");
const User = require("../models/user.model");
const config = require("../config");
const jwt = require("jwt-simple");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    const user = await new User({ username });
    await User.register(user, password);
    const payload = {
      id: user._id,
    };
    const token = jwt.encode(payload, config.jwtSecret);

    res.json({ token: token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(442).send(error.message);
  }
};

exports.login = async function (req, res) {
  console.log(req.body);
  console.log("Logged In");
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    console.log("Error Happened In auth /token Route");
  } else {
    var payload = {
      id: user.id,
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
    };
    var token = jwt.encode(payload, config.jwtSecret);
    res.json({
      token: token,
      userId: user._id,
      username: user.username,
    });
  }
};
