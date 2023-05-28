const socketIO = require("socket.io");
const Chat = require("./models/chat.model");
const { getChat } = require("./controllers/chat.controller");

function initializeSocket(server) {
  const io = socketIO(server);

  // Handle incoming Socket.IO connections
  io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id}`);

    // Handle events from the client
    socket.on("chat message", async (message) => {
      console.log("Received message:", message);

      const chat = await new Chat({
        sender: message.sender,
        recipient: message.receiver,
        message: message.msg,
      }).populate([
        { path: "sender", select: "username" },
        { path: "recipient", select: "username" },
      ]);

      await chat.save();
      if (message.isReply) {
        io.emit(message.sender, chat);
      } else {
        io.emit(message.receiver, chat);
      }
      // Broadcast the message to all connected clients
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = initializeSocket;
