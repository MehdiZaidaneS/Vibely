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

const searchUsers = async (req, res) => {
    const { query } = req.query;
    const currentUserId = req.query.userId;

    try {
        if (!query) {
            return res.status(200).json([]);
        }

        const users = await UserModel.find({
            _id: { $ne: currentUserId }, // Exclude current user
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
        .select('name email profile_pic')
        .limit(10);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed searching users" });
    }
}

const getUserbyId = async (req, res) => {
    const userId = req.params.userId

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Not valid ID" })
    }

    try {
        const user = await UserModel.findOne({ _id: userId })
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: "Couldnt find the user" })
    }
}


const createNewUser = async (req, res) => {

    const { name, email, phone, password, profile_pic } = req.body

    try {
        const newUser = await UserModel.signup(name, email, phone, password, profile_pic)

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

const checkUserName = async (req,res) =>{
    const {username} = req.params
    try {
        const findUser = await UserModel.findOne({username: username})

        if(findUser){
            return res.status(200).json({status: "taken"})
        }else{
             return res.status(200).json({status: "available"})
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


const addFriendRequest = async (req, res) => {
    const { userId } = req.params
    const currentUserId = req.user._id

    console.log("=== ADD FRIEND REQUEST DEBUG ===");
    console.log("Target userId:", userId);
    console.log("Current userId:", currentUserId);

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const targetUser = await UserModel.findById(userId)
        if (!targetUser) {
            console.log("Target user not found");
            return res.status(404).json({ message: "User not found" })
        }

        const currentUser = await UserModel.findById(currentUserId)
        if (!currentUser) {
            console.log("Current user not found");
            return res.status(404).json({ message: "Current user not found" })
        }

        console.log("Current user friends:", currentUser.friends);
        console.log("Target user friend_requests:", targetUser.friend_requests);

        // Check if already friends
        if (currentUser.friends.some(id => id.toString() === userId)) {
            console.log("Already friends");
            return res.status(400).json({ message: "You are already friends" });
        }

        // Check if request already sent
        if (targetUser.friend_requests.some(id => id.toString() === currentUserId.toString())) {
            console.log("Friend request already sent");
            return res.status(400).json({ message: "Friend request already sent" });
        }

        targetUser.friend_requests.push(currentUserId);
        await targetUser.save();

        console.log("Friend request sent successfully");
        return res.status(200).json({ message: "Friend request sent successfully" });

    } catch (err) {
        console.error("Error adding friend:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

const acceptFriendRequest = async (req, res) => {
    const userId = req.user._id; // logged in user
    const { requested_friend_id } = req.params; // the one who sent the request

    try {
        if (!mongoose.Types.ObjectId.isValid(requested_friend_id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const targetUser = await UserModel.findById(requested_friend_id);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Current user not found" });
        }

        const hasRequest = user.friend_requests.some(id =>
            id.equals(requested_friend_id)
        );

        if (!hasRequest) {
            return res.status(400).json({ message: "User has not sent you a friend request" });
        }

        // add each other as friends
        if (!user.friends.some(id => id.equals(requested_friend_id))) {
            user.friends.push(targetUser._id);
        }

        if (!targetUser.friends.some(id => id.equals(userId))) {
            targetUser.friends.push(user._id);
        }

        user.friend_requests.pull(requested_friend_id);

        await user.save();
        await targetUser.save();

        // Automatically create a chatroom for the new friends
        const ChatRoom = require('../models/chatRoomModel');

        let chatRoom = await ChatRoom.findOne({
            isGroup: false,
            participants: { $all: [userId, requested_friend_id], $size: 2 }
        });

        if (!chatRoom) {
            chatRoom = new ChatRoom({
                isGroup: false,
                participants: [userId, requested_friend_id]
            });
            await chatRoom.save();
            console.log("Created chatroom for new friends:", chatRoom._id);
        }

        return res.status(200).json({
            message: "Friend request accepted successfully",
            friends: user.friends,
            chatroomId: chatRoom._id
        });

    } catch (err) {
        console.error("Error accepting friend:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


const deleteFriendRequest = async (req,res) =>{

    const userId = req.user._id;
    const { requested_friend_id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(requested_friend_id)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const targetUser = await UserModel.findById(requested_friend_id);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Current user not found" });
        }

        const hasRequest = user.friend_requests.some(id =>
            id.equals(requested_friend_id)
        );

        if (!hasRequest) {
            return res.status(400).json({ message: "User has not sent you a friend request" });
        }

        user.friend_requests.pull(requested_friend_id);

        await user.save();
        await targetUser.save();

        return res.status(200).json({
            message: "Friend request deleted successfully",
            friends: user.friends
        });

    } catch (err) {
        console.error("Error deleting friend:", err);
        return res.status(500).json({ message: "Server error" });
    }

}

const removeFriend = async (req, res) => {
    const userId = req.user._id;
    const { friendId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const friend = await UserModel.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Check if they are actually friends
        const areFriends = user.friends.some(id => id.equals(friendId));
        if (!areFriends) {
            return res.status(400).json({ message: "You are not friends with this user" });
        }

        // Remove from both users' friend lists
        user.friends.pull(friendId);
        friend.friends.pull(userId);

        await user.save();
        await friend.save();

        // Delete the private chatroom between these two users
        const ChatRoom = require('../models/chatRoomModel');
        const Message = require('../models/messageModel');

        console.log("Searching for chatroom between:", userId, "and", friendId);

        const chatRoom = await ChatRoom.findOne({
            isGroup: false,
            participants: { $all: [userId, friendId], $size: 2 }
        });

        console.log("Found chatroom:", chatRoom?._id);

        if (chatRoom) {
            // Delete all messages in the chatroom
            const deletedMessages = await Message.deleteMany({ chatRoom: chatRoom._id });
            console.log("Deleted messages count:", deletedMessages.deletedCount);

            // Delete the chatroom
            await ChatRoom.findByIdAndDelete(chatRoom._id);
            console.log("Chatroom deleted:", chatRoom._id);
        } else {
            console.log("No chatroom found to delete");
        }

        return res.status(200).json({
            message: "Friend removed successfully",
            friends: user.friends,
            deletedChatRoom: chatRoom?._id
        });

    } catch (err) {
        console.error("Error removing friend:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


const getJoinedEvents = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId)
            .populate({
                path: 'joinedEvents',        // populate the events the user joined
                populate: {
                    path: 'author',          // nested populate: populate author inside each event
                    select: 'name email profile_pic' // select fields you want from author
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
    leaveEventFromUserPage,
    getUserbyId,
    addFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    removeFriend,
    checkUserName,
    searchUsers

}
