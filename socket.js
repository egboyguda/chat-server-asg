const socketIO = require("socket.io");

function initializeSocket(server) {
  const io = socketIO(server);

  // Handle incoming Socket.IO connections
  io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id}`);

    // Handle events from the client
    socket.on("chat message", (message) => {
      console.log("Received message:", message);

      // Broadcast the message to all connected clients
      io.emit("chat message", message);
    });
    //handle private msg
    socket.on("private-msg", (data) => {
      const { recepient, sender, message } = data;

      io.emit(recepient, { sender, messages });
    });
    // Handle disconnections
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = initializeSocket;
