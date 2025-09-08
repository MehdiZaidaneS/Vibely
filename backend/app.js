const dotenv = require("dotenv")
dotenv.config()
const port = process.env.PORT

const express = require("express")
const app = express()
const userRouter = require("./routes/userRouter")




// Middleware to parse JSON
app.use(express.json());


app.use("/users", userRouter)





app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})