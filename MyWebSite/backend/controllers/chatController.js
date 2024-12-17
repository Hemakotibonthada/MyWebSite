// backend/controllers/chatController.js

const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

// Fetch All Chats for the Logged-in User with Pagination and Sorting
exports.getAllChats = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sort = req.query.sort || 'createdAt';

        const chats = await Chat.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }],
        })
            .populate('sender', 'firstName lastName email')
            .populate('receiver', 'firstName lastName email')
            .sort({ [sort]: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalChats = await Chat.countDocuments({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }],
        });

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            page,
            totalPages: Math.ceil(totalChats / limit),
            chats,
        });
    } catch (error) {
        console.error(`Error fetching chats: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Send a New Message
exports.sendMessage = async (req, res) => {
    const { receiverId, message, isGroup } = req.body;

    try {
        if (!receiverId || !message) {
            return res.status(400).json({ message: "Receiver ID and message are required." });
        }

        const chat = new Chat({
            sender: req.user.id,
            receiver: receiverId,
            message,
            isGroup: isGroup || false,
            status: "Delivered",
        });

        await chat.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error sending message: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Add Reaction to a Message
exports.addReaction = async (req, res) => {
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

// Edit a Message
exports.editMessage = async (req, res) => {
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

// Search Chats
exports.searchChats = async (req, res) => {
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

// Mark Chat as Seen
exports.markAsSeen = async (req, res) => {
    const { messageId } = req.params;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.status = "Seen";
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message marked as seen",
            chat,
        });
    } catch (error) {
        console.error(`Error marking message as seen: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Clear All Chat History
exports.clearChatHistory = async (req, res) => {
    const { receiverId } = req.body;

    try {
        await Chat.deleteMany({
            $or: [
                { sender: req.user.id, receiver: receiverId },
                { sender: receiverId, receiver: req.user.id },
            ],
        });

        res.status(200).json({
            success: true,
            message: "Chat history cleared successfully.",
        });
    } catch (error) {
        console.error(`Error clearing chat history: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};