// {
//     "username": "mehdiz",
//     "email": "mehdi@gmail.com",
//     "phonenumber": 1231241,
//     "password": "123"
// }

const mongoose = require("mongoose")

const Schema = mongoose.Schema


const userSchema = new Schema(
    {
        fullName:{
            type: String,
            required: true

        },
        email:{
            type: String,
            required: true

        },
        phonenumber:{
            type: String,
            required: true

        },
        password:{
            type: String,
            required: true

        },
        username:{
            type: String,
            required: false

        },
        interests:{
            type: String,
            required: false

        },
    }, {timestamps: true}
);



module.exports = mongoose.model("User", userSchema);


