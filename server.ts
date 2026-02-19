import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import type {
  RoomState,
  Card,
  ServerToClientEvents,
  ClientToServerEvents,
} from "./src/types/game";
import { CARD_VALUES } from "./src/lib/cardData";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// In-memory room storage
const rooms = new Map<string, RoomState>();



function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createRoom(code: string): RoomState {
  const shuffledValues = shuffleArray(CARD_VALUES);
  const cards: Card[] = shuffledValues.map((value, index) => ({
    id: `card-${index}`,
    value,
    revealed: false,
  }));

  return {
    code,
    cards,
    playerCount: 0,
  };
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    }
  );

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    let currentRoom: string | null = null;

    socket.on("room:create", (callback) => {
      let code = generateRoomCode();
      // Ensure unique code
      while (rooms.has(code)) {
        code = generateRoomCode();
      }

      const room = createRoom(code);
      rooms.set(code, room);
      console.log(`Room created: ${code}`);
      callback(code);
    });

    socket.on("room:join", (code) => {
      const upperCode = code.toUpperCase();
      const room = rooms.get(upperCode);

      if (!room) {
        socket.emit("room:error", "Room not found");
        return;
      }

      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        const prevRoom = rooms.get(currentRoom);
        if (prevRoom) {
          prevRoom.playerCount--;
          io.to(currentRoom).emit("room:player-count", prevRoom.playerCount);
          // Auto-cleanup empty rooms
          if (prevRoom.playerCount <= 0) {
            rooms.delete(currentRoom);
            console.log(`Room cleaned up: ${currentRoom}`);
          }
        }
      }

      currentRoom = upperCode;
      socket.join(upperCode);
      room.playerCount++;

      // Send full state to the joining client
      socket.emit("room:state", room);
      // Notify all clients of new player count
      io.to(upperCode).emit("room:player-count", room.playerCount);
      console.log(
        `Client ${socket.id} joined room ${upperCode} (${room.playerCount} players)`
      );
    });

    socket.on("room:reveal-card", ({ roomCode, cardId }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const card = room.cards.find((c) => c.id === cardId);
      if (!card || card.revealed) return;

      // Ensure only the top unrevealed card can be revealed
      const topUnrevealed = room.cards.find((c) => !c.revealed);
      if (!topUnrevealed || topUnrevealed.id !== cardId) return;

      card.revealed = true;
      // Broadcast to ALL clients in the room (including sender)
      io.to(roomCode).emit("room:card-revealed", cardId);
      console.log(`Card ${cardId} revealed in room ${roomCode}`);
    });

    socket.on("room:reset", (roomCode) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const shuffledValues = shuffleArray(CARD_VALUES);
      room.cards = shuffledValues.map((value, index) => ({
        id: `card-${index}`,
        value,
        revealed: false,
      }));

      io.to(roomCode).emit("room:reset", room);
      console.log(`Room ${roomCode} reset`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      if (currentRoom) {
        const room = rooms.get(currentRoom);
        if (room) {
          room.playerCount--;
          io.to(currentRoom).emit("room:player-count", room.playerCount);
          // Auto-cleanup empty rooms
          if (room.playerCount <= 0) {
            rooms.delete(currentRoom);
            console.log(`Room cleaned up: ${currentRoom}`);
          }
        }
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
