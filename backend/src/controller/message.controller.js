import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"


export const getUsersForSideBar = async (req, res) =>{
    try{
        const loggedInUser = req.user.id
        const filteredUsers = await User.find({_id : {$ne:loggedInUser}}).select('-password')       //get all the users where iod is not equal to loggedIn id(basically don't get our own name in the list)

        res.status(200).json(filteredUsers)
    }catch(error){
        console.log('Error in getUsersForSideBar : ', error.message)
        res.status(500).json({ message:'Internal Server Error' })
    }
}

export const getMessages = async (req, res) =>{
    try{
        const {id: userToChatId} = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    }catch(error){
        console.log('Error in getMessages controller ', error.message)
        res.status(500).json({ message:'Internal Server Error' })
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            console.log("Uploading chat image to Cloudinary...");
            
            // Create a unique identifier for the image that doesn't rely on timestamps
            const uniqueId = `chat_${senderId}_${receiverId}_${Date.now()}`;
            
            const uploadOptions = {
                folder: "chat_images",
                resource_type: "image",
                public_id: uniqueId,
                use_filename: false,
                unique_filename: false,
                overwrite: true,
                cross_origin: "*"
            };
            
            const uploadResponse = await cloudinary.uploader.upload(image, uploadOptions);
            
            console.log("Chat image uploaded successfully!");
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(`Sending message to receiver ${receiverId}, Socket ID: ${receiverSocketId}`);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("📨 Message sent successfully via socket!");
        } else {
            console.log("Receiver is not online.");
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
