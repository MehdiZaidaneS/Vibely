const UserModel = require("../models/userModel.js")


const getAllUsers = (req, res)=>{
    res.json(UserModel.getAllUsers())
}

const createNewUser= (req,res) => {
    const newUser = UserModel.createUser({...req.body})
    if(newUser){
        res.status(201).json(newUser)
    }else{
        res.status(500).json({message: "Fail creating"})
    }
}





module.exports = {
    getAllUsers,
    createNewUser
}
