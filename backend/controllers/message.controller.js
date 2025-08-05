import { Conversation } from "../models/conversation.model.js";
//For Chatting

export const sendMessage = async(req,res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        // validate the message
        if(!message) {
            return res.status(400).json({
                success: false,
                error: "Message content is required"
            });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: {$all:[senderId, receiverId] },
        });

        if(!conversation) {
            conversation = await Conversation.create({participants: [senderId, receiverId],
                message:[]
            });
        }
        // Create and save the new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // Implement socket.IO for real-time data transfer

        return res.status(201).json({
            success: true,
            newMessage
        })
    } catch(error){
        console.error('Error sending message');
        return res.status(500).json({
            success: false,
            error: 'An error occurred while sending the message'
        })
    }
}
