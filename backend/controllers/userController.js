const UserModel = require("../models/userModel.js")
const Event = require("../models/eventModel");

const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv") 
dotenv.config() 



const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: "3d",
    })
}



const getAllUsers = async (req, res) => {

    try {
        const users = await UserModel.find({}).sort({ createdAt: -1 })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: "Failed retrieving the users" })
    }
}


const createNewUser = async (req, res) => {

    const { name, email, phone, password } = req.body

    try {
        const newUser = await UserModel.signup(name, email, phone, password)

        const token = generateToken(newUser._id)
        res.status(201).json({ user: newUser, token })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const getRegisteredUser = async (req, res) => {
    const { email, password } = req.body
    try {

        const user = await UserModel.login(email, password)

        if (user) {
            const token = generateToken(user._id);
            res.status(200).json({ user: user, token })
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}


const addInfo = async (req, res) => {

    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Not valid ID" })
    }

    try {

        const updatedData = { ...req.body }

        delete updatedData.interests

        const updateQuery = { $set: updatedData };

        if (req.body.interests && req.body.interests.length > 0) {
            updateQuery.$addToSet = { interests: { $each: Array.isArray(req.body.interests) ? req.body.interests : [req.body.interests] } };
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateQuery,
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json(updatedUser)
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error updatiding user" })
    }
}

const getJoinedEvents = async (req, res) => {
    
     const { userId } = req.params

    try {
        const user = await UserModel.findById(userId).populate('joinedEvents');
        res.status(200).json(user.joinedEvents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching joined events', error });
    }
};
const leaveEventFromUserPage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.body.event;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove user from event.participant
    const participantIndex = event.participant.findIndex(
      id => id.toString() === userId
    );
    if (participantIndex !== -1) {
      event.participant.splice(participantIndex, 1);
      await event.save();
    }

    // Remove event from user.joinedEvents
    const eventIndex = user.joinedEvents.findIndex(
      id => id.toString() === eventId
    );
    if (eventIndex !== -1) {
      user.joinedEvents.splice(eventIndex, 1);
      await user.save();
    }

    res.status(200).json({ message: 'Successfully left event' });
  } catch (error) {
    res.status(500).json({
      message: 'Error leaving event from user page',
      error: error.message,
    });
  }
};


module.exports = {
    getAllUsers,
    createNewUser,
    getRegisteredUser,
    addInfo,
    getJoinedEvents,
    leaveEventFromUserPage
}
