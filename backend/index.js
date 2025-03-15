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
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOption));

// Socket.io Initialization
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    // User disconnects
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    // Handle incoming call from a user
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    // Handle answering the call
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // ICE Candidate Handling (forwarding the ICE candidates)
    socket.on("iceCandidate", ({ candidate, to }) => {
        socket.to(to).emit("newIceCandidate", candidate);
    });
});

// Routes
app.use('/api/auth/', authRouter);
app.use('/api/user/', mainRouter);

// Server Initialization
const PORT = process.env.PORT || 8000;
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
