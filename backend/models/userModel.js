const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true

        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        phone: {
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
        countryCode: {
            type: String,
            required: false
        },
        interests: [{
            type: String,
            required: false

        }],
        profile_pic:{
          type:String,
          required: false,
          default: ''
        },
        joinedEvents:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event'
            }]
            
        ,
        notifications:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Notification'
            }
        ]
        ,
        friends:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        friend_requests:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]

    }, { timestamps: true }
);


userSchema.statics.signup = async function (name, email, phone, password, profile_pic) {
    if (!name || !email || !phone || !password) {
        throw Error("All fields are required. Please complete the form.");
    }

    if (!validator.isEmail(email)) {
        throw Error("Please enter a valid email address (example: name@email.com).");
    }

    if (!validator.isStrongPassword(password)) {
        throw Error(
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        );

    }

    const userExists = await this.findOne({ email });
    if (userExists) {
       throw Error("An account with this email already exists. Please log in instead.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await this.create({
        name,
        email,
        phone,
        password: hashedPassword,
        profile_pic: profile_pic || ''
    })

    return user
}


userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("Both email and password are required.");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("No account found with this email. Please sign up first.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("The password you entered is incorrect. Please try again.");
    }

    return user;
};




module.exports = mongoose.model("User", userSchema);


