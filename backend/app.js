const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT

const express = require("express")
const app = express()
const cors = require("cors")
const userRouter = require("./routes/userRouter")
const notificationRouter = require("./routes/notificationsRouter")

const connectDB = require("./config/db")
const eventRouter = require("./routes/eventRouter")

connectDB()




// Middleware to parse JSON
app.use(express.json());
app.use(cors())



// API endpoints for core features
// Handles user registration and login
app.use("/api/users", userRouter);    

// Manages event creation, and leaving and joing      
app.use("/api/events", eventRouter);    
    
// Sends and fetches user notifications
app.use("/api/notifications", notificationRouter); 






app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})