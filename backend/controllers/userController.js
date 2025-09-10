const UserModel = require("../models/userModel.js")
const mongoose = require("mongoose")


const getAllUsers = async (req, res) => {

    try {
        const users = await UserModel.find({}).sort({ createdAt: -1 })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: "Failed retrieving the users" })
    }
}


const createNewUser = async (req, res) => {

    try {
        const newUser = await UserModel.create({ ...req.body })
        res.status(201).json(newUser)

    } catch (error) {
        res.status(400).json({ message: "Error creating the user", error: error.message })
    }

}

const getRegisteredUser = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            res.status(404).json({ message: "User not found" })
        }

        if (user.password === password) {
            res.status(200).json(user)
        } else {
            res.status(401).json({ message: "Wrong password" })
        }

    } catch (error) {
        res.status(500).json({ message: "Error Logging in" })
    }

}


const addInfo = async (req, res) => {

    const {userId} = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Not valid ID" })
    }

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { ...req.body },
            { new: true }
        );

        if(updatedUser){
            res.status(200).json(updatedUser)
        }else{
            res.status(404).json({message: "User not found"})
        }
    } catch (error) {
         res.status(500).json({message: "Error updatiding user"})
    }
}




module.exports = {
    getAllUsers,
    createNewUser,
    getRegisteredUser,
    addInfo
}
