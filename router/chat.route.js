const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const auth = require("../middleware/auth")();

router.route("/").get(chatController.getChat);
router.route("/del").delete(auth.authenticate(), chatController.deleteChat);
module.exports = router;
