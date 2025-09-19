const mongoose = require("mongoose")

const Schema = mongoose.Schema


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true

        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        phoneNumber: {
            type: String,
            required: true

        },
        password: {
            type: String,
            required: true

        },
        username: {
            type: String,
            required: false

        },
        interests: [{
            type: String,
            required: false

        }],
        joinedEvents:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
            }],

    }, { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);


