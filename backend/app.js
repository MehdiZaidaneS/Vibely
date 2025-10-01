const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT

const express = require("express")
const app = express()
const cors = require("cors")
const userRouter = require("./routes/userRouter")
const notificationRouter = require("./routes/notificationsRouter")
const generateText  = require("./controllers/AIeventController");

const connectDB = require("./config/db")
const eventRouter = require("./routes/eventRouter")
const chatRouter = require('./routes/chatRouter.js');
connectDB()
const http = require('http');
const { Server } = require('socket.io');



// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'))



app.use("/api/users", userRouter)
app.use("/api/events", eventRouter)
app.use("/api/notifications", notificationRouter)
app.post('/api/AIevent', generateText)
app.use('/api/chatrooms', chatRouter)

//chatroom servers
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});
// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Join a chatroom
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Listen for new messages
  socket.on('sendMessage', (message) => {
    const { roomId, sender, content } = message;

    // broadcast to all users in the room except sender
    socket.to(roomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});