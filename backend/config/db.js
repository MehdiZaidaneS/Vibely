const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const conexion = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conexion.connection.host}`);

    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports = connectDB;