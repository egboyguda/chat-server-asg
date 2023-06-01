const express = require("express");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
exports.getChat = async (req, res) => {
  const user = req.user._id;
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

exports.deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.body.id;
    console.log(otherUserId);
    // Delete all chat messages where the sender is either req.user or req.query.id
    const chat = await Chat.deleteMany({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(userId),
          recipient: new mongoose.Types.ObjectId(otherUserId),
        },
        {
          sender: new mongoose.Types.ObjectId(otherUserId),
          recipient: new mongoose.Types.ObjectId(userId),
        },
      ],
    });
    console.log(chat);
    res.json({ message: "Chat messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
