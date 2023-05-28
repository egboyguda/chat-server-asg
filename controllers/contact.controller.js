const express = require("express");
const User = require("../models/user.model");
const Contact = require("../models/contact.model");

exports.getUser = async (req, res) => {
  const { username } = req.query;
  const user = await User.findByUsername(username);
  res.send(user);
};

exports.addContact = async (req, res) => {
  console.log(req.body);
  const contact = await Contact({
    name: req.body.username,
    contactby: req.user,
  });
  await contact.save();
  res.send("save");
};

exports.getContact = async (req, res) => {
  const contact = await Contact.find({ contactby: req.user }).populate(
    "name",
    "username"
  );
  console.log(contact);
  res.send(contact);
};
