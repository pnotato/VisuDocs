import { Server } from "socket.io";
import express from 'express';

// Socketing

const io = new Server(3000, {
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

// Express

const app = express();
const server = http.createServer(app)

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });