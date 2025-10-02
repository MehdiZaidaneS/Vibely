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
 checkUserName,
 getFriendRequests,
 getFriends
} = require("../controllers/userController.js")





router.post("/",createNewUser)

router.post("/login", getRegisteredUser)

router.get("/:userId", getUserbyId)



router.get("/check-username/:username", checkUserName)



router.use(requireAuth);

router.get("/", getAllUsers)
router.post("/friend-requests", getFriendRequests)
router.patch('/:userId/leave-event', leaveEventFromUserPage);
router.get('/:userId/joined-events', getJoinedEvents);
router.patch("/:userId", addInfo)
router.post("/add/:userId", addFriendRequest)
router.post("/accept/:requested_friend_id", acceptFriendRequest)
router.delete("/delete/:requested_friend_id", deleteFriendRequest)
router.post("/friends", getFriends)



module.exports = router