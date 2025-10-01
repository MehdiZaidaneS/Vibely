
const notificationModel = require("../models/notificationModel")
const UserModel = require("../models/userModel")
const mongoose = require("mongoose")


const getAll = async (req, res) => {
    try {
        const notifications = await notificationModel.find({}).sort({ createdAt: -1 })

        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: "Fail getting notifications" })
    }
}

const createNotification = async (req, res) => {
    try {
        let { sender, receiver, content, type } = req.body;

        if (!mongoose.Types.ObjectId.isValid(receiver)) {
            return res.status(400).json({ message: "Invalid receiver ID" });
        }

        const senderInfo = await UserModel.findById(sender);

        if (!senderInfo) {
            return res.status(400).json({ message: "Invalid sender" });
        }

        if (type === "Friend Request") {
            content = `${senderInfo.username} wants to send you a friend request!`;
        }

        // Create the notification
        const notification = await notificationModel.create({
            sender,
            receiver,
            content,
            type
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(400).json({ message: "Failed creating the notification" });
    }
};



const getMyNotifications = async (req, res) => {

    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Wrong credentials" })
    }

    try {
        const notifications = await notificationModel.find({ receiver: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: "Error finding users notifications" })
    }
}

const deleteNotification = async (req, res) => {

    const { notificationId } = req.params

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({ message: "Wrong credentials" })
    }

    try {
        const deletedNotification = await notificationModel.findOneAndDelete({ _id: notificationId });
        if (deletedNotification) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ message: "Notification not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete notification" });
    }
}



module.exports = {
    getAll,
    createNotification,
    getMyNotifications,
    deleteNotification
}