const express = require("express");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
exports.getChat = async (req, res) => {
  const { user } = req.query;
  const chat = await Chat.aggregate([
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(user) },
          { recipient: new mongoose.Types.ObjectId(user) },
        ],
      },
    },
    {
      $sort: { timestamp: 1 },
    },
    {
      $lookup: {
        from: "users", // Assuming the collection name is 'users'
        localField: "sender",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    {
      $lookup: {
        from: "users", // Assuming the collection name is 'users'
        localField: "recipient",
        foreignField: "_id",
        as: "recipientInfo",
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", new mongoose.Types.ObjectId(user)] },
            "$recipient",
            "$sender",
          ],
        },
        conversation: {
          $push: {
            sender: {
              $arrayElemAt: ["$senderInfo.username", 0],
            },
            recipient: {
              $arrayElemAt: ["$recipientInfo.username", 0],
            },
            message: "$message",
            timestamp: "$timestamp",
          },
        },
      },
    },
  ]);
  res.send(chat);
};
