const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller");
const auth = require("../middleware/auth")();
router.route("/").get(contactController.getUser);
router.route("/add").post(auth.authenticate(), contactController.addContact);
router.route("/contact").get(auth.authenticate(), contactController.getContact);
module.exports = router;
