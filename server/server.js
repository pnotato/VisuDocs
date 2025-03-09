import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);

// Socketing

// This is done so both the websocket server and express can use port 3000 without having a stroke
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

// Express

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

server.listen(3000, () => {
    console.log('===========================================\nExpress and WebSockets running on port 3000\n===========================================');
  });