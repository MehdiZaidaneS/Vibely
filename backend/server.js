require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const User = require('./models/userModel');
const Message = require('./models/messageModel');

const userRoutes = require('./routes/usersRouter');
const messageRoutes = require('./routes/messageRouter');
const chatRoutes = require('./routes/chatRouter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatrooms', chatRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  // Join chat room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🚪 Socket ${socket.id} joined room ${roomId}`);
    // Confirm room membership
    const rooms = Array.from(socket.rooms);
    console.log(`📍 Socket ${socket.id} is now in rooms:`, rooms);
  });

  // Send message to room
  socket.on('sendMessage', ({ chatroomId, message }) => {
    console.log(`📨 Received sendMessage event from socket ${socket.id}`);
    console.log(`📍 Target room: ${chatroomId}`);
    console.log(`💬 Message:`, message);

    // Get all sockets in the room
    const socketsInRoom = io.sockets.adapter.rooms.get(chatroomId);
    console.log(`👥 Sockets in room ${chatroomId}:`, socketsInRoom ? Array.from(socketsInRoom) : 'none');

    // Broadcast the message to everyone in the room (including sender)
    io.to(chatroomId).emit('receiveMessage', message);
    console.log(`✅ Message broadcasted to room ${chatroomId}`);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});


// Connect to DB and Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
