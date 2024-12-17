const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

// ====================== Fetch All Chats ======================
const getAllChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({
            participants: userId,
        })
            .populate('participants', 'firstName lastName email')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats,
        });
    } catch (error) {
        console.error(`Error fetching chats: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Failed to fetch chats",
            error: error.message,
        });
    }
};

// ====================== Fetch Chat by ID ======================
const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId).populate('participants', 'firstName lastName email');
        
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error fetching chat by ID: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// ====================== Send a New Message ======================
const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { message, senderId } = req.body;

        if (!message || !senderId) {
            return res.status(400).json({
                success: false,
                message: "Message and senderId are required",
            });
        }

        // Find the chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // Add new message to the chat
        const newMessage = {
            sender: senderId,
            content: message,
            sentAt: new Date(),
        };

        chat.messages.push(newMessage);
        chat.lastMessage = newMessage;
        await chat.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// ====================== Add Reaction to a Message ======================
const addReaction = async (req, res) => {
    const { messageId, reaction } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.reactions.push({ userId: req.user.id, reaction });
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Reaction added successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error adding reaction: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ====================== Edit a Message ======================
// ====================== Edit a Message ======================
const editMessage = async (req, res) => {
    const { messageId, newMessage } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        if (chat.sender.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to edit this message." });
        }

        chat.message = newMessage;
        chat.edited = true;
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message edited successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error editing message: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ====================== Search Chats ======================
// ====================== Search Chats ======================
const searchChats = async (req, res) => {
    const { keyword } = req.query;

    try {
        const chats = await Chat.find({
            $and: [
                { $or: [{ sender: req.user.id }, { receiver: req.user.id }] },
                { message: { $regex: keyword, $options: 'i' } },
            ],
        }).populate('sender receiver', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats,
        });
    } catch (error) {
        console.error(`Error searching chats: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ====================== Mark Chat as Seen ======================
const markAsSeen = async (req, res) => {
    const { chatId, messageId } = req.params; // Chat ID and Message ID

    try {
        // Find the chat by ID
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
        }

        // Locate the specific message within the chat's messages array
        const message = chat.messages.id(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found." });
        }

        // Update the status of the message to "Seen"
        message.status = "Seen";
        message.seenAt = new Date(); // Optional: Add timestamp for "seen"

        // Save the updated chat document
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message marked as seen",
            updatedMessage: message,
        });
    } catch (error) {
        console.error(`Error marking message as seen: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ====================== Clear All Chat History ======================
const clearChatHistory = async (req, res) => {
    const { receiverId } = req.body;

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not logged in.",
            });
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required.",
            });
        }

        // Clear the chat history
        const result = await Chat.updateMany(
            { participants: { $all: [req.user.id, receiverId] } },
            { $set: { messages: [] } }
        );

        res.status(200).json({
            success: true,
            message: "Chat history cleared successfully.",
            result,
        });
    } catch (error) {
        console.error(`Error clearing chat history: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
// ====================== Export All Functions ======================
module.exports = {
    getAllChats,
    getChatById,
    sendMessage,
    addReaction,
    editMessage,
    searchChats,
    markAsSeen,
    clearChatHistory,
};