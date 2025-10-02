const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/requireAuth");



const {
    getAll,
    createNotification,
    getMyNotifications,
    deleteNotification
} = require("../controllers/notificationController")



router.get("/", getAll)
router.delete("/:notificationId", deleteNotification)
router.post("/", createNotification)

router.use(requireAuth);
router.post("/getNotifications", getMyNotifications)





module.exports = router