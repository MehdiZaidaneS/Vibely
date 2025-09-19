const express = require("express")
const router = express.Router()

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

router.patch("/:userId", addInfo)

router.get('/joined-events', getJoinedEvents);

router.patch('/leave-event/:eventId', leaveEventFromUserPage);



module.exports = router