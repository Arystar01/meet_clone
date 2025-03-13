import { Model, Schema } from "mongoose";

const chatSchema= new Schema({
    message:{
        type : String,
        required : true
    },
    UID:{
        type:Schema.Types.ObjectId,ref:"User"},
        MID:{
            type:Schema.Types.ObjectId,ref:"Meet"},

    
}, {
    timestamps: true
})

export default mongoose.model('Chat',chatSchema);
