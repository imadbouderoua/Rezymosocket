const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const socketIo = require('socket.io');

const server = http.createServer(app);
// const io = new Server(server);
const cors = require('cors');

// Enable CORS for Express.js
app.use(cors({
  origin: "*", // Replace this with your frontend's URL if needed
  methods: ["GET", "POST"]
}));
const io = socketIo(server, {
  cors: {
    origin: "*", // Frontend URL that is allowed to connect
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (userIds) => {
    // Sort user IDs to make sure the room is the same regardless of the user who starts the conversation
    const sortedUserIds = userIds.sort();
    const roomId = `room-${sortedUserIds.join('-')}`;

    // Join the calculated room
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('message', (msgData) => {
    const { roomId, message } = msgData;
    console.log(`Message received in room ${roomId}:`, message);

    // Emit the message to everyone in the room
    io.to(roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
