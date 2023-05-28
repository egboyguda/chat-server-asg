const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./router/auth.route");
const chatRoute = require("./router/chat.route");
const contactRoute = require("./router/contact.route");
const initializeSocket = require("./socket");
const localStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user.model");
const auth = require("./middleware/auth.js")();
require("dotenv").config();
const http = require("http");
const app = express();
const server = http.createServer(app);
mongoose.connect(process.env.DB_HOST || "mongodb://127.0.0.1:27017/chat-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const multer = require("multer");
const upload = multer();
app.use(upload.array());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(auth.initialize());

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DATABASE IS CONNECTED");
});

passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
//app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoute);
app.use("/chat", chatRoute);
app.use("/user", contactRoute);

initializeSocket(server);
server.listen(3000, () => console.log("server is started"));
