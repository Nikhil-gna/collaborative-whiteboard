import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

interface User {
  id: string;
  name: string;
}

interface RoomData {
  users: User[];
  lines: any[];
  image: string | null;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms: Record<string, RoomData> = {};

io.on("connection", (socket: Socket) => {
  socket.on(
    "joinRoom",
    ({ roomId, name }: { roomId: string; name: string }) => {
      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = { users: [], lines: [], image: null };
      rooms[roomId].users.push({ id: socket.id, name });

      // Send current state (lines and image) to the new user
      socket.emit("initCanvas", {
        lines: rooms[roomId].lines,
        image: rooms[roomId].image,
      });

      io.to(roomId).emit("userJoined", rooms[roomId].users);
    }
  );

  socket.on("drawing", ({ roomId, line }: { roomId: string; line: any }) => {
    if (rooms[roomId]) {
      rooms[roomId].lines.push(line);
      io.to(roomId).emit("drawing", { line });
    }
  });

  socket.on(
    "undo",
    ({
      roomId,
      lines,
      image,
    }: {
      roomId: string;
      lines: any[];
      image: string | null;
    }) => {
      if (rooms[roomId]) {
        rooms[roomId].lines = lines;
        rooms[roomId].image = image;
        io.to(roomId).emit("undo", { lines, image });
      }
    }
  );

  socket.on(
    "redo",
    ({
      roomId,
      lines,
      image,
    }: {
      roomId: string;
      lines: any[];
      image: string | null;
    }) => {
      if (rooms[roomId]) {
        rooms[roomId].lines = lines;
        rooms[roomId].image = image;
        io.to(roomId).emit("redo", { lines, image });
      }
    }
  );

  socket.on(
    "addImage",
    ({ roomId, image }: { roomId: string; image: string }) => {
      if (rooms[roomId]) {
        rooms[roomId].image = image;
        io.to(roomId).emit("addImage", { image });
      }
    }
  );

  socket.on("clearBoard", (roomId: string) => {
    if (rooms[roomId]) {
      rooms[roomId].lines = [];
      rooms[roomId].image = null;
      io.to(roomId).emit("clearBoard");
    }
  });

  socket.on(
    "mouseMove",
    ({ roomId, x, y }: { roomId: string; x: number; y: number }) => {
      const user = rooms[roomId]?.users.find((user) => user.id === socket.id);
      if (user) {
        io.to(roomId).emit("mouseUpdate", {
          id: socket.id,
          name: user.name,
          x,
          y,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.id !== socket.id
      );
      io.to(roomId).emit("userLeft", rooms[roomId].users);

      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
