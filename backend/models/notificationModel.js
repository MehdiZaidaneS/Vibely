const mongoose = require("mongoose")

const Schema = mongoose.Schema

const notificationModel = new Schema(
    {  
        sender: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User', 
            required: false 
        },
        receiver: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'User', 
            required: true 
        },
        content:{
            type: String,
            required: true
        },
        type:{
            type:String,
            required: true
        }
    },{timestamps: true}
)


module.exports = mongoose.model("Notification", notificationModel)