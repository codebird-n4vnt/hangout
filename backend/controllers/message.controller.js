import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (err) {
    console.error("Error in getUserForSidebar :", err.message);
    res.status(500).json({ message: `Error in getUserForSidebar ${err}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getUserForSidebar :", err.message);
    res.status(500).json({ message: `Error in getUserForSidebar ${err}` });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      let uploadResponse = await cloudinary.uploader.upload(image, {
        chunk_size: 6000000,
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: `sendMessage err ${err}` });
  }
};
