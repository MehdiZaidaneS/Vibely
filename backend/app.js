const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT || 5000

const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path") // <-- Add this
const userRouter = require("./routes/userRouter")
const notificationRouter = require("./routes/notificationsRouter")
const eventRouter = require("./routes/eventRouter")
const chatRouter = require('./routes/chatRouter.js');
const connectDB = require("./config/db")
connectDB()

const http = require('http');
const { Server } = require('socket.io');

// Middleware to parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: 'https://social-networking-app-cxqd.onrender.com',
  credentials: true,
}))

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'))

// --- API ROUTES ---
app.use("/api/users", userRouter)
app.use("/api/events", eventRouter)
app.use("/api/notifications", notificationRouter)
app.use('/api/chatrooms', chatRouter)

// --- SERVE REACT BUILD FILES ---
// Make sure your React build folder is correctly referenced (adjust if your folder is in a subfolder)
app.use(express.static(path.join(__dirname, 'client/build')))

// --- CATCH-ALL ROUTE FOR SPA ---
// This MUST come AFTER all API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', ({ chatroomId, message }) => {
    io.to(chatroomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
