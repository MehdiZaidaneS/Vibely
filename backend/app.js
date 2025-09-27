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

connectDB()




// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}))



app.use("/api/users", userRouter)
app.use("/api/events", eventRouter)
app.use("/api/notifications", notificationRouter)
app.post('/api/AIevent', generateText);




app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})