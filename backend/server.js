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

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join chat room
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Send message to room
  socket.on('sendMessage', async ({ roomId, sender, content }) => {
    const message = await Message.create({ chatRoom: roomId, sender, content });

    // Broadcast to everyone else in the room (except sender)
    socket.to(roomId).emit('newMessage', message);

    // Optionally, send to sender too (for confirmation/UI update)
    socket.emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
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
