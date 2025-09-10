const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT

const express = require("express")
const app = express()
const userRouter = require("./routes/userRouter")

const connectDB = require("./config/db")

connectDB()




// Middleware to parse JSON
app.use(express.json());



app.use("/api/users", userRouter)





app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})