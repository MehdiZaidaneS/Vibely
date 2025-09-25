const UserModel = require("../models/userModel.js")
const mongoose = require("mongoose")
<<<<<<< Updated upstream
=======
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv") 
dotenv.config() 


const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: "3d",
    })
}
>>>>>>> Stashed changes


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

const getJoinedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('joinedEvents');
    res.status(200).json(user.joinedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching joined events', error });
  }
};
const leaveEventFromUserPage = async (req, res) => {
  try {
    const user = req.user;
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Remove user from event.participant
    const Index = event.participant.indexOf(user._id);
    if (Index !== -1) {
      event.participant.splice(Index, 1);
      await event.save();
    }

    // Remove event from user.joinedEvents
    const eventIndex = user.joinedEvents.indexOf(event._id);
    if (eventIndex !== -1) {
      user.joinedEvents.splice(eventIndex, 1);
      await user.save();
    }

    res.status(200).json({ message: 'Successfully left event' });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving event from user page', error });
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
