const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/requireAuth");

const {
 getAllUsers,
 createNewUser,
 getRegisteredUser,
 addInfo,
 getJoinedEvents,
 leaveEventFromUserPage
} = require("../controllers/userController.js")




router.get("/", getAllUsers)

router.post("/",createNewUser)

router.post("/login", getRegisteredUser)

router.get('/joined-events', getJoinedEvents);

router.patch('/leave-event/:eventId', leaveEventFromUserPage);

router.use(requireAuth);

router.patch("/:userId", addInfo)


module.exports = router