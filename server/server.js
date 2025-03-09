import { Server } from "socket.io";

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



