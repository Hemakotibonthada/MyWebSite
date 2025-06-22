// backend/routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const {
    getChats,
    getChatById,
    createChat,
    sendMessage,
    deleteMessage,
    pinMessage,
    unpinMessage,
    addReaction,
    removeReaction,
    updateTypingStatus,
    getPinnedMessages,
    addReplyToMessage,
    fetchMessageReplies,
    fetchChatMessages,
    archiveChat,
    unarchiveChat,
    addCallLog,
} = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== CHAT ROUTES ======================

// @route   GET /api/chats
// @desc    Fetch all chats for a user
// @access  Private
router.get("/", authMiddleware, getChats);

// @route   GET /api/chats/:chatId
// @desc    Fetch a single chat by ID
// @access  Private
router.get("/:chatId", authMiddleware, getChatById);

// @route   POST /api/chats
// @desc    Create a new chat (one-on-one or group chat)
// @access  Private
router.post("/", authMiddleware, createChat);

// ====================== MESSAGE ROUTES ======================

// @route   POST /api/chats/:chatId/messages
// @desc    Send a new message in a chat
// @access  Private
router.post("/:chatId/messages", authMiddleware, sendMessage);

// @route   DELETE /api/chats/:chatId/messages/:messageId
// @desc    Delete a specific message
// @access  Private
router.delete("/:chatId/messages/:messageId", authMiddleware, deleteMessage);

// @route   POST /api/chats/:chatId/messages/:messageId/reply
// @desc    Add a reply to a message
// @access  Private
router.post("/:chatId/messages/:messageId/reply", authMiddleware, addReplyToMessage);

// @route   GET /api/chats/:chatId/messages/:messageId/replies
// @desc    Fetch replies for a specific message
// @access  Private
router.get("/:chatId/messages/:messageId/replies", authMiddleware, fetchMessageReplies);

// @route   GET /api/chats/:chatId/messages
// @desc    Fetch all messages in a chat
// @access  Private
router.get("/:chatId/messages", authMiddleware, fetchChatMessages);

// ====================== MESSAGE REACTIONS ======================

// @route   POST /api/chats/:chatId/messages/:messageId/reactions
// @desc    Add a reaction to a message
// @access  Private
router.post("/:chatId/messages/:messageId/reactions", authMiddleware, addReaction);

// @route   DELETE /api/chats/:chatId/messages/:messageId/reactions
// @desc    Remove a reaction from a message
// @access  Private
router.delete("/:chatId/messages/:messageId/reactions", authMiddleware, removeReaction);

// ====================== PINNED MESSAGES ======================

// @route   POST /api/chats/:chatId/messages/:messageId/pin
// @desc    Pin a message in a chat
// @access  Private
router.post("/:chatId/messages/:messageId/pin", authMiddleware, pinMessage);

// @route   POST /api/chats/:chatId/messages/:messageId/unpin
// @desc    Unpin a message in a chat
// @access  Private
router.post("/:chatId/messages/:messageId/unpin", authMiddleware, unpinMessage);

// @route   GET /api/chats/:chatId/pinned-messages
// @desc    Fetch all pinned messages in a chat
// @access  Private
router.get("/:chatId/pinned-messages", authMiddleware, getPinnedMessages);

// ====================== TYPING STATUS ======================

// @route   POST /api/chats/:chatId/typing
// @desc    Update typing status for a user
// @access  Private
router.post("/:chatId/typing", authMiddleware, updateTypingStatus);

// ====================== CHAT ARCHIVING ======================

// @route   POST /api/chats/:chatId/archive
// @desc    Archive a chat
// @access  Private
router.post("/:chatId/archive", authMiddleware, archiveChat);

// @route   POST /api/chats/:chatId/unarchive
// @desc    Unarchive a chat
// @access  Private
router.post("/:chatId/unarchive", authMiddleware, unarchiveChat);

// ====================== CALL LOG ROUTES ======================

// @route   POST /api/chats/:chatId/calls
// @desc    Add a call log to a chat
// @access  Private
router.post("/:chatId/calls", authMiddleware, addCallLog);

// ====================== EXPORT ROUTER ======================
module.exports = router;