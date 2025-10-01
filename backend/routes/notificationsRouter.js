const express = require("express")
const router = express.Router()



const {
    getAll,
    createNotification,
    getMyNotifications,
    deleteNotification
} = require("../controllers/notificationController")



router.get("/", getAll)


router.get("/:userId", getMyNotifications)

router.delete("/:notificationId", deleteNotification)
router.post("/", createNotification)






module.exports = router