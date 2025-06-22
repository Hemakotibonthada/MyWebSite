// backend/models/Chat.js

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Schema for Reactions (like, love, laugh, etc.)
const reactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reaction: { type: String, enum: ["like", "love", "laugh", "angry", "sad", "wow"], required: true },
    createdAt: { type: Date, default: Date.now },
});

// Schema for Message Attachments (images, files, etc.)
const attachmentSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "video", "file", "audio"], required: true },
    uploadedAt: { type: Date, default: Date.now },
});

// Main Schema for Chat Messages
const messageSchema = new mongoose.Schema(
    {
        messageId: {
            type: String,
            default: uuidv4, // Unique ID for every message
            unique: true,
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: false,
        },
        attachments: [attachmentSchema], // Array of attachments
        reactions: [reactionSchema], // Array of reactions
        messageType: {
            type: String,
            enum: ["text", "media", "file", "system"],
            default: "text",
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "seen"],
            default: "sent",
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },
        seenAt: {
            type: Date,
            default: null,
        },
        editHistory: [
            {
                editedContent: { type: String, trim: true },
                editedAt: { type: Date, default: Date.now },
            },
        ],
        replies: [
            {
                replyId: { type: String, default: uuidv4 },
                senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                content: { type: String, trim: true },
                sentAt: { type: Date, default: Date.now },
                reactions: [reactionSchema],
            },
        ],
        isPinned: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Schema for Chat (One-on-One or Group)
const chatSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            default: uuidv4, // Unique chat ID
            unique: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String, // Group chat name (if applicable)
            trim: true,
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [messageSchema], // Array of messages
        lastMessage: {
            content: { type: String, trim: true },
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            sentAt: { type: Date, default: Date.now },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        typingStatus: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                isTyping: { type: Boolean, default: false },
            },
        ],
        archivedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        pinnedMessages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        callLogs: [
            {
                callId: { type: String, default: uuidv4 },
                type: { type: String, enum: ["voice", "video"], required: true },
                initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                duration: { type: String, required: true },
                status: { type: String, enum: ["missed", "completed", "failed"], default: "completed" },
                startedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// ========================== PRE-SAVE HOOK ==========================
chatSchema.pre("save", function (next) {
    if (this.isGroupChat && !this.name) {
        this.name = `Group Chat - ${Date.now()}`;
    }
    next();
});

// ========================== METHODS ==========================

// Add Message
chatSchema.methods.addMessage = function (messageData) {
    this.messages.push(messageData);
    this.lastMessage = {
        content: messageData.content || "Attachment",
        senderId: messageData.senderId,
        sentAt: messageData.sentAt,
    };
    return this;
};

// Update Message Status
chatSchema.methods.updateMessageStatus = function (messageId, status) {
    const message = this.messages.id(messageId);
    if (message) {
        if (status === "delivered") message.deliveredAt = new Date();
        if (status === "seen") message.seenAt = new Date();
        message.status = status;
    }
    return this;
};

// Pin a Message
chatSchema.methods.pinMessage = function (messageId) {
    if (!this.pinnedMessages.includes(messageId)) {
        this.pinnedMessages.push(messageId);
    }
};

// Unpin a Message
chatSchema.methods.unpinMessage = function (messageId) {
    this.pinnedMessages = this.pinnedMessages.filter((id) => id.toString() !== messageId);
};

// Archive Chat for User
chatSchema.methods.archiveChat = function (userId) {
    if (!this.archivedBy.includes(userId)) {
        this.archivedBy.push(userId);
    }
};

// Unarchive Chat
chatSchema.methods.unarchiveChat = function (userId) {
    this.archivedBy = this.archivedBy.filter((id) => id.toString() !== userId);
};

// Update Typing Status
chatSchema.methods.updateTypingStatus = function (userId, isTyping) {
    const userIndex = this.typingStatus.findIndex((t) => t.userId.toString() === userId);
    if (userIndex >= 0) {
        this.typingStatus[userIndex].isTyping = isTyping;
    } else {
        this.typingStatus.push({ userId, isTyping });
    }
};

// Add Call Log
chatSchema.methods.addCallLog = function (callData) {
    this.callLogs.push(callData);
};

module.exports = mongoose.model("Chat", chatSchema);