import mongoose from 'mongoose';
import express from 'express';
import authRoutes from "./database/Routes/auth.js";
import projectRoutes from "./database/Routes/projects.js";
import userRoutes from "./database/Routes/users.js";
import cookieParser from 'cookie-parser';
import http from 'http';
import 'dotenv/config'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server as SocketIOServer } from "socket.io";
import { createClient } from 'redis';
import Project from './database/Models/Project.js';

// Since this is a smaller scope, dictionaries are used for temporary code storage in the server
// Basically, when a new user joins the websocket room, the data will be  saved into these dictionaries.
//
// This data does not persist between server resets. There is a save button I have implemented that will
// save the data to MongoDB, and will load the data from there instead when the first person joins the room.
//
// Perhaps this can be solved with redis?

const roomData = {};
const roomLang = {};
const roomMessages = {};

// Initialization Flags. 

const verbose = process.argv.includes('-l') || process.argv.includes('--log');
if (verbose) {
    console.log("\n\x1b[32m[server.js] Verbose Mode -- Server updates are logged.\x1b[0m")
}

dotenv.config()
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
const server = http.createServer(app);
if (verbose) {
    console.log("\x1b[32m[server.js] Express server initialized :)\x1b[0m")
}


const redisClient = createClient();


// Redis
async function redis() {
    try {
        await redisClient.connect();
        if (verbose) {
            console.log("\x1b[32m[server.js] Redis client initialized :)\x1b[0m")
        }
    } catch(error) {
        console.log("\x1b[31m[server.js] Redis error :(\x1b[0m")
        console.error(error)
    }
}
// Logic: Redis is updated everytime the project is updated. Keys are stored for 30 min, or 1800 seconds.
// Data is synced with MongoDB every 2 minutes. If no changes have occured in 30 min, and a new person joins,
// We pull the data from MongoDB instead.


// MongoDB

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_KEY)
        if (verbose) {
            console.log("\x1b[32m[server.js] Connected to MongoDB :)\x1b[0m")
        }
    } catch(error) {
        console.log("\x1b[31m[server.js] Could not connect to MongoDB :(\x1b[0m")
    }
}


// Socketing

async function websockets() {

    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173"],
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        socket.on('join-room', async (roomId) => {
            socket.join(roomId);
            const users = io.sockets.adapter.rooms.get(roomId);
            const userCount = users ? users.size : 0
            if (verbose) {
                console.log(`\x1b[33m[${roomId}] UserCount: ${userCount}\x1b[0m`);
            }
            
            let [code, language, messages, title] = await Promise.all([
                redisClient.get(`roomData:${roomId}`),
                redisClient.get(`roomLanguage:${roomId}`),
                redisClient.lRange(`roomMessages:${roomId}`, 0, -1),
                redisClient.get(`roomTitle:${roomId}`),
            ]);

            // Fallback, if the data expires, grab the data from MongoDB.
            // Occurs if the room is idle for over 30 min.
            if (!code || !language) {
                try {
                    const project = await Project.findById(roomId);
                    if (project) {
                        code = project.code;
                        language = project.language;
                    }
                    if (code) {
                        await redisClient.set(`roomData:${roomId}`, code, { EX: 1800 });
                    }
                    if (language) {
                        await redisClient.set(`roomLang:${roomId}`, language, { EX: 1800 });
                    }
                    
                } catch(error) {
                    console.log(error)
                }
            }

            
            if (userCount === 1) {
                socket.emit('editor-initialization', {room: roomId})
            } else {
                if (code) {
                    socket.emit('editor-update-return', { room: roomId, value: code });
                }
                if (language) {
                    socket.emit('language-update-return', { room: roomId, language: language });
                }
                if (title) {
                    socket.emit('title-update-return', { room: roomId, title: title });
                }
                if (messages) {
                    socket.emit('message-update-return', { room: roomId, messages: messages });
                }
            }
        });


        socket.on('message-update', async ({ room, message }) => {
            await redisClient.rPush(`roomMessages:${room}`, message);
            await redisClient.expire(`roomMessages:${room}`, 1800);
            io.to(room).emit('message-update-return', { room, message });
        });
        socket.on('editor-update', async ({ room, value }) => {
            if (typeof value === 'string') {
                await redisClient.set(`roomData:${room}`, value, { EX: 1800 });
            } else {
                console.warn(`[Redis] Skipped storing non-string value for room ${room}:`, value);
            }
            io.to(room).emit('editor-update-return', { room, value }); // Sends update to all clients in the room
        });
        
        socket.on('language-update', async ({ room, language }) => {
            await redisClient.set(`roomLanguage:${room}`, language, { EX: 1800 })
            io.to(room).emit('language-update-return', { room, language });
        });

        socket.on('title-update', async ({ room, title }) => {
            await redisClient.set(`roomTitle:${room}`, title, { EX: 1800 })
            io.to(room).emit('title-update-return', { room, title})
        })

        socket.on('disconnect', () => {
            if (verbose) {
                console.log(`\x1b[33m[server.js] User ${socket.id} disconnected \x1b[0m`);
            }
        });
    });
    if (verbose) {
        console.log("\x1b[32m[server.js] Websocket server initialized :)\x1b[0m");
    }
}

setInterval(async () => {
    const rooms = await redisClient.keys("roomData:*");
    try {
        for (let key of rooms) {
            const roomId = key.split(":")[1];
            const [code, language, messages, title] = await Promise.all([
                redisClient.get(`roomData:${roomId}`),
                redisClient.get(`roomLang:${roomId}`),
                redisClient.lRange(`roomMessages:${roomId}`, 0, -1),
                redisClient.get(`roomTitle:${roomId}`)
            ]);
    
            if (code || language || title) {
                await Project.findByIdAndUpdate(roomId, { code, language, title, messages });
            }
        }
        if (verbose) {
            const now = new Date().toLocaleTimeString();
            console.log(`\x1b[32m[server.js] Active room data saved to MongoDB -- ${now} :)\x1b[0m`);
        }
    } catch(error) {
        console.log(error)
    }
    
}, 120000);  // Every 2 min
// Express

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(cookieParser())
app.use(express.json()) 
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/users", userRoutes)


server.listen(3000, async () => {
    await connect()
    await websockets()
    await redis()
    console.log('\x1b[32m[server.js] Server running on port 3000 :)\x1b[0m\n');
});