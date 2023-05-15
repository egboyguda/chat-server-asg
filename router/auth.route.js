const User = require("../models/user.model");
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.route("/login").post(authController.login);

router.route("/register").post(authController.register);

module.exports = router;
