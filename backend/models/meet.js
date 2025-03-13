import mongoose, { Schema } from "mongoose";

const meetSchema = new Schema({
    meet_Id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    meet_type: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    host_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    attendees: [{
        type: String,  
        required: true
    }],
    time: {
        type: Date,
        required: true
    },
   
    locked: {
        type: Boolean,
        required: true,
        default: false
    },
    chats: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Chat" 
    }]
}, { timestamps: true });

// Creating the model instance using `new`
const Meet = new mongoose.model("Meet", meetSchema);

export default Meet;
