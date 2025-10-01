const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/requireAuth");

const {
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
 checkUserName
} = require("../controllers/userController.js")




router.get("/", getAllUsers)

router.post("/",createNewUser)

router.post("/login", getRegisteredUser)

router.get("/:userId", getUserbyId)



router.get("/check-username/:username", checkUserName)

router.use(requireAuth);

router.patch('/:userId/leave-event', leaveEventFromUserPage);
router.get('/:userId/joined-events', getJoinedEvents);
router.patch("/:userId", addInfo)
router.post("/:userId", addFriendRequest)
router.post("/accept/:requested_friend_id", acceptFriendRequest)
router.delete("/delete/:requested_friend_id", deleteFriendRequest)



module.exports = router