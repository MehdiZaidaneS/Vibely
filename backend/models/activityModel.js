const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const activitySchema = new Schema(
    {   
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        type:{
            type: String,
            required: false
        },
        content:{
            type:String,
            required: false
        }
        
    },
    {timestamps: true}
)



module.exports = mongoose.model("Activity", activitySchema)