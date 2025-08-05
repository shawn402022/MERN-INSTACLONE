import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    receivedId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    message: { type:String, required:true}
});

export const Messages = mongoose.model("Message", messageSchema)
