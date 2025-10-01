const express = require("express")
const router = express.Router()


const {
    getAll,
    createNotification,
    getMyNotifications,
    deleteNotification
} = require("../controllers/notificationController")



router.get("/", getAll)

router.post("/", createNotification)

router.get("/:userId", getMyNotifications)

router.delete("/:notificationId", deleteNotification)






module.exports = router