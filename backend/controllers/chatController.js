// backend/controllers/chatController.js

const Chat = require('../models/Chat');
const User = require('../models/User');
const mongoose = require('mongoose');

// Fetch All Chats for the Logged-in User with Pagination and Sorting
exports.getChats = async (req, res) => {
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

// Get Chat by ID
exports.getChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId)
            .populate('sender', 'firstName lastName email')
            .populate('receiver', 'firstName lastName email');

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error fetching chat: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create a New Chat
exports.createChat = async (req, res) => {
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
            message: "Chat created successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error creating chat: ${error.message}`);
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

// Delete a Message
exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        if (chat.sender.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to delete this message." });
        }

        await chat.remove();

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error(`Error deleting message: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Pin a Message
exports.pinMessage = async (req, res) => {
    const { messageId } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.pinned = true;
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message pinned successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error pinning message: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Unpin a Message
exports.unpinMessage = async (req, res) => {
    const { messageId } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.pinned = false;
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Message unpinned successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error unpinning message: ${error.message}`);
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

// Remove Reaction from a Message
exports.removeReaction = async (req, res) => {
    const { messageId, reaction } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.reactions = chat.reactions.filter(
            (r) => r.userId.toString() !== req.user.id || r.reaction !== reaction
        );
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Reaction removed successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error removing reaction: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Typing Status
exports.updateTypingStatus = async (req, res) => {
    const { receiverId, isTyping } = req.body;

    try {
        // Logic to update typing status in the database or in-memory store

        res.status(200).json({
            success: true,
            message: "Typing status updated",
        });
    } catch (error) {
        console.error(`Error updating typing status: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get Pinned Messages
exports.getPinnedMessages = async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }],
            pinned: true,
        })
            .populate('sender', 'firstName lastName email')
            .populate('receiver', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: "Pinned messages fetched successfully",
            chats,
        });
    } catch (error) {
        console.error(`Error fetching pinned messages: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Add Reply to a Message
exports.addReplyToMessage = async (req, res) => {
    const { messageId, reply } = req.body;

    try {
        const chat = await Chat.findById(messageId);
        if (!chat) {
            return res.status(404).json({ message: "Message not found." });
        }

        chat.replies.push({ userId: req.user.id, reply });
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error adding reply: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch Message Replies
exports.fetchMessageReplies = async (req, res) => {
    const { messageId } = req.params;

    try {
        const chat = await Chat.findById(messageId)
            .populate('replies.userId', 'firstName lastName email');

        if (!chat) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        res.status(200).json({
            success: true,
            message: "Replies fetched successfully",
            replies: chat.replies,
        });
    } catch (error) {
        console.error(`Error fetching replies: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch Chat Messages
exports.fetchChatMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId)
            .populate('sender', 'firstName lastName email')
            .populate('receiver', 'firstName lastName email');

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({
            success: true,
            message: "Chat messages fetched successfully",
            messages: chat.messages,
        });
    } catch (error) {
        console.error(`Error fetching chat messages: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Archive a Chat
exports.archiveChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.archived = true;
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Chat archived successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error archiving chat: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Unarchive a Chat
exports.unarchiveChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.archived = false;
        await chat.save();

        res.status(200).json({
            success: true,
            message: "Chat unarchived successfully",
            chat,
        });
    } catch (error) {
        console.error(`Error unarchiving chat: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Add Call Log
exports.addCallLog = async (req, res) => {
    const { callType, duration, participants } = req.body;

    try {
        const callLog = new CallLog({
            userId: req.user.id,
            callType,
            duration,
            participants,
        });

        await callLog.save();

        res.status(201).json({
            success: true,
            message: "Call log added successfully",
            callLog,
        });
    } catch (error) {
        console.error(`Error adding call log: ${error.message}`);
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