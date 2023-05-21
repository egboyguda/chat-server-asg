const express = require("express");
const Chat = require("../models/chat.model");
exports.getChat = async (req, res) => {
  console.log(req.query);
};
