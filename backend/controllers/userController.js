const UserModel = require("../models/userModel.js")
const Event = require("../models/eventModel");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const notificationModel = require("../models/notificationModel.js");
dotenv.config()



const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, {
        expiresIn: "3d",
    })
}

const getAllUsers = async (req, res) => {
    const userId = req.user._id;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Get the current user's friends and friend_requests
        const currentUser = await UserModel.findById(userId)
            .select("friends friend_requests")
            .populate("friends", "_id"); // populate friends to compare for mutual friends

        if (!currentUser) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Get all users except self and already friends
        const users = await UserModel.find({
            _id: { $nin: [userId, ...currentUser.friends.map(f => f._id)] }
        })
            .sort({ createdAt: -1 })
            .populate("friends", "_id"); // populate friends to compute mutual friends

        const usersWithStatus = users.map(user => {
            // Check if current user has already sent a friend request to them
            const hasSentRequest = user.friend_requests?.some(req =>
                req.user.equals(userId)
            );

            // Check if current user has received a friend request from them
            const hasReceivedRequest = currentUser.friend_requests?.some(req =>
                req.user.equals(user._id)
            );

            // Calculate mutual friends count
            const mutualFriends = user.friends.filter(f =>
                currentUser.friends.some(cf => cf._id.equals(f._id))
            ).length;

            return {
                _id: user._id,
                name: user.name,
                username: user.username,
                profile_pic: user.profile_pic,
                interests: user.interests,
                createdAt: user.createdAt,
                friendRequestPending: hasSentRequest ? "Pending" : "Add Friend",
                friendRequestReceived: hasReceivedRequest ? "Respond" : null,
                mutualFriends
            };
        });

        res.status(200).json(usersWithStatus);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed retrieving the users" });
    }
};


const getFriends = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId)
            .populate("friends"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed retrieving friends" });
    }
};


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

const checkUserName = async (req, res) => {
    const { username } = req.params
    try {
        const findUser = await UserModel.findOne({ username: username })

        if (findUser) {
            return res.status(200).json({ status: "taken" })
        } else {
            return res.status(200).json({ status: "available" })
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

        // Add the current user's ID to friend_requests array
        targetUser.friend_requests.push(currentUserId);
        await targetUser.save();

        //Creating notification
        const notification = await notificationModel.create({
            sender: currentUserId,
            receiver: userId,
            content: `${currentUser.username} wants to send you a friend request!`,
            type: "Friend Request"
        });

        return res.status(200).json({ message: "Friend request sent successfully", notification });

    } catch (err) {
        console.error("Error adding friend:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}

const acceptFriendRequest = async (req, res) => {
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

        const user = await UserModel.findById(userId).populate("notifications");
        if (!user) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Check if friend request exists (friend_requests now contains ObjectIds directly)
        const hasRequest = user.friend_requests.some(requesterId =>
            requesterId.toString() === requested_friend_id.toString()
        );

        if (!hasRequest) {
            return res.status(400).json({ message: "User has not sent you a friend request" });
        }


        if (!user.friends.some(id => id.equals(requested_friend_id))) {
            user.friends.push(targetUser._id);
        }

        if (!targetUser.friends.some(id => id.equals(userId))) {
            targetUser.friends.push(user._id);
        }


        // Remove the friend request (friend_requests contains ObjectIds directly)
        user.friend_requests = user.friend_requests.filter(
            requesterId => requesterId.toString() !== requested_friend_id.toString()
        );

        const requestNotification = await notificationModel.findOneAndDelete({
            receiver: userId,
            sender: requested_friend_id,
            type: "Friend Request" 
        });

        if (requestNotification) {
    
            user.notifications = user.notifications.filter(
                n => !n.equals(requestNotification._id)
            );
        }

        await user.save();
        await targetUser.save();

      
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



const getFriendRequests = async (req, res) => {
    const userId = req.user._id;

    try {
        const currentUser = await UserModel.findById(userId)
            .select("friend_requests friends")
            .populate("friend_requests friends");

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const usersWithStatus = currentUser.friend_requests.map(user => {
            // user is now the populated user document directly (ObjectId reference)

            const mutualFriends = user.friends.filter(f =>
                currentUser.friends.some(cf => cf._id.equals(f._id))
            ).length;

            return {
                _id: user._id,
                name: user.name,
                username: user.username,
                profile_pic: user.profile_pic,
                interests: user.interests,
                createdAt: user.createdAt,
                mutualFriends
            };
        });

        res.status(200).json(usersWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};





const deleteFriendRequest = async (req, res) => {
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


        // Check if friend request exists (friend_requests now contains ObjectIds directly)
        const hasRequest = user.friend_requests.some(requesterId =>
            requesterId.toString() === requested_friend_id.toString()
        );

        if (!hasRequest) {
            return res.status(400).json({ message: "User has not sent you a friend request" });
        }

        // Remove the friend request (friend_requests contains ObjectIds directly)
        user.friend_requests = user.friend_requests.filter(
            requesterId => requesterId.toString() !== requested_friend_id.toString()
        );

        const requestNotification = await notificationModel.findOneAndDelete({
            receiver: userId,
            sender: requested_friend_id,
            type: "Friend Request" 
        });

        if (requestNotification) {
    
            user.notifications = user.notifications.filter(
                n => !n.equals(requestNotification._id)
            );
        }

        await user.save();

        return res.status(200).json({
            message: "Friend request deleted successfully",
            friends: user.friends
        });

    } catch (err) {
        console.error("Error deleting friend request:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


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
    checkUserName,
    getFriendRequests,
    getFriends,
    removeFriend,
    checkUserName,
    searchUsers

}
