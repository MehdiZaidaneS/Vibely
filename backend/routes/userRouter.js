const express = require("express")
const router = express.Router()

const {
 getAllUsers,
 createNewUser
} = require("../controllers/userController.js")


router.get("/", getAllUsers)

router.post("/",createNewUser)




module.exports = router