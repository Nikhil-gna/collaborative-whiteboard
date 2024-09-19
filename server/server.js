// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("undo", (updatedLines) => {
    socket.broadcast.emit("undo", updatedLines);
  });

  socket.on("redo", (updatedLines) => {
    socket.broadcast.emit("redo", updatedLines);
  });

  socket.on("addImage", (imageData) => {
    socket.broadcast.emit("addImage", imageData);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Listening on *:3001");
});
