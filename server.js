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

dotenv.config()
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
const server = http.createServer(app);
console.log("\n\x1b[32m[server.js] Express server initialized :)\x1b[0m")

// MongoDB

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_KEY)
        console.log("\x1b[32m[server.js] Connected to MongoDB :)\x1b[0m")
    } catch(error) {
        console.log("\x1b[31m[server.js] Could not connect to MongoDB :(\x1b[0m")
    }
}


// Socketing

async function websockets() {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173"]
        }
    });
    
    io.on("connection", (socket) => {
        console.log(`User joined with ID: ${socket.id}`)
    
        socket.on('editor-update', value => {
            // console.log(value);
            io.emit('editor-update-return', value)
        })
    
    })
    console.log("\x1b[32m[server.js] Websocket server initialized :)\x1b[0m")
}


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
    console.log('\x1b[32m[server.js] Server running on port 3000 :)\x1b[0m\n');
  });