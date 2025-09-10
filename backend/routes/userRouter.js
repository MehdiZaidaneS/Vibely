const express = require("express")
const router = express.Router()

const {
 getAllUsers,
 createNewUser,
 getRegisteredUser,
 addInfo
} = require("../controllers/userController.js")



router.get("/", getAllUsers)

router.post("/",createNewUser)

router.get("/login", getRegisteredUser)

router.patch("/:userId", addInfo)




module.exports = router