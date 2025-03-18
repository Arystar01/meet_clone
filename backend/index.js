import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import authRouter from './Router/authRouter.js';
import mainRouter from './Router/MainRouter.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

// Socket.io Initialization
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
let rooms = {};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  // When a user joins a room
  socket.on("joinRoom", ({ meetid, userId, micOn, videoOn }) => {
    socket.join(meetid);
    if (!rooms[meetid]) {
      rooms[meetid] = [];
      console.log(`[JOIN] Created room: ${meetid}`);
    }
    const newUser = { userId, socketId: socket.id, micOn, videoOn, handRaised: false };
    rooms[meetid].push(newUser);
    console.log(`[JOIN] ${userId} (${socket.id}) joined room: ${meetid}. Current users:`, rooms[meetid]);
    socket.broadcast.to(meetid).emit("userJoined", newUser);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    // Find the room that the user was in
    for (let room in rooms) {
      const roomIndex = rooms[room].findIndex(
        (user) => user.socketId === socket.id
      );
      if (roomIndex !== -1) {
        rooms[room].splice(roomIndex, 1); // Remove the user from the room

        // Notify others in the room that this user has left
        socket.broadcast.to(room).emit("userLeft", { socketId: socket.id });

        // If no one is left in the room, you can delete the room
        if (rooms[room].length === 0) {
          delete rooms[room];
        }

        break;
      }
    }

    socket.broadcast.emit("callEnded");
  });

  socket.on("userRaisedHand", ({ meetid, userId }) => {
    console.log(`[RAISE] Received raise hand request for room: ${meetid}, user: ${userId}, socket: ${socket.id}`);
    if (rooms[meetid]) {
      const user = rooms[meetid].find((u) => u.userId === userId);
      if (user) {
        user.handRaised = true;
        io.to(meetid).emit("userRaisedHand", { userId, meetid });
        console.log(`[RAISE] ${userId} raised hand in room: ${meetid}. Updated room:`, rooms[meetid]);
      } else {
        console.log(`[RAISE] User ${userId} not found in room: ${meetid}`);
      }
    } else {
      console.log(`[RAISE] Room ${meetid} does not exist!`);
    }
  });

  socket.on("userLoweredHand", ({ meetid, userId }) => {
    console.log(`[LOWER] Received lower hand request for room: ${meetid}, user: ${userId}, socket: ${socket.id}`);
    if (rooms[meetid]) {
      const user = rooms[meetid].find((u) => u.userId === userId);
      if (user) {
        user.handRaised = false;
        io.to(meetid).emit("userLoweredHand", { userId, meetid });
        console.log(`[LOWER] ${userId} lowered hand in room: ${meetid}. Updated room:`, rooms[meetid]);
      } else {
        console.log(`[LOWER] User ${userId} not found in room: ${meetid}`);
      }
    } else {
      console.log(`[LOWER] Room ${meetid} does not exist!`);
    }
  });

  socket.on("checkRoom", (userId) => {
    // Assuming 'room' is based on a user's id or some other identifier
    const room = rooms[userId]; // Adjust this to match how you track rooms
    if (room) {
      io.to(room).emit("roomStatus", io.sockets.adapter.rooms.get(room));
    }
  });
  // Handle incoming call from a user
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  // Handle answering the call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

socket.on("callEnded", () => {
    console.log(`[LEAVE CALL] User ${socket.id} is leaving the call.`);
    // Inform the other peer that the call has ended gracefully
    socket.broadcast.emit("callEnded");
    // You might want to perform additional cleanup here if needed
});

  // ICE Candidate Handling (forwarding the ICE candidates)
  socket.on("iceCandidate", ({ candidate, to }) => {
    socket.to(to).emit("newIceCandidate", candidate);
  });
});

// Routes
app.use("/api/auth/", authRouter);
app.use("/api/user/", mainRouter);

// Server Initialization
const PORT = process.env.PORT || 8000;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});