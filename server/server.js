import mongoose from 'mongoose';
import 'dotenv/config'
import path from 'path';
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";

const app = express();
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
        // console.log(`User joined with ID: ${socket.id}`)
    
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

server.listen(3000, async () => {
    await connect()
    await websockets()
    console.log('\x1b[32m[server.js] Server running on port 3000 :)\x1b[0m\n');
  });