import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './utils/db.js';
import authRouter from './Router/authRouter.js';
import mainRouter from './Router/MainRouter.js';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import http from 'http';
import User from './models/user.js';
import Meet from './models/meet.js';
import { isAuthenticated } from './Middleware/isAuthenticated.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const peerServer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peerServer);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOption));

io.on('connection', (socket) => {
    socket.on('join-room', async (userData) => {
        try {
            const { meetId, userID } = userData;
            if (!meetId || !userID) {
                console.error("Invalid join-room data", userData);
                return;
            }
            socket.join(meetId);
            socket.broadcast.to(meetId).emit('user-connected', userData);

            socket.on('sendMessage', async (incomingData) => {
                try {
                    const { meetId, senderId, message } = incomingData;
                    if (!meetId || !senderId || !message) return;
                    
                    const sender = await User.findById(senderId);
                    if (!sender) return;
                    
                    io.to(meetId).emit('receiveMessage', {
                        sender: { _id: sender._id, username: sender.username },
                        message,
                    });
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            });

            socket.on("lockMeeting", async (incomingData) => {
                try {
                    console.log("lockMeeting", incomingData);
                    await Meet.findOneAndUpdate({ meetId }, { locked: incomingData });
                    io.to(meetId).emit("lockMeeting", incomingData);
                } catch (error) {
                    console.error("Error locking meeting:", error);
                }
            });

            socket.on("raiseHand", (incomingData) => {
                io.to(meetId).emit("onRaiseHand", incomingData);
            });

            socket.on("newPoll", (incomingData) => {
                io.to(meetId).emit("onNewPoll", incomingData);
            });

            socket.on("respondPoll", (incomingData) => {
                io.to(meetId).emit("respondPoll", incomingData);
            });

            socket.on("forceQuit", (incomingData) => {
                io.to(meetId).emit("forceQuit", incomingData);
            });

            socket.on("changeTab", (incomingData) => {
                io.to(meetId).emit("changeTab", incomingData);
            });

            socket.on('disconnect', () => {
                if (meetId && userID) {
                    socket.broadcast.to(meetId).emit("user-disconnected", userID);
                }
            });
        } catch (error) {
            console.error("Error handling join-room:", error);
        }
    });
});

app.use('/api/auth/', authRouter);
app.use('/api/user/', mainRouter);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
