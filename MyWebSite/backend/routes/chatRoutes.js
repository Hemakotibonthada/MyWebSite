const express = require("express");
const router = express.Router();
const { 
    getAllChats, 
    getChatById, 
    sendMessage, 
    addReaction, 
    editMessage, 
    searchChats, 
    markAsSeen, 
    clearChatHistory 
} = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Routes
router.get("/", authMiddleware, getAllChats); // Fetch all chats
router.get("/:chatId", authMiddleware, getChatById);
router.post("/message", authMiddleware, sendMessage);
router.post("/message/:messageId/reaction", authMiddleware, addReaction);
router.put("/message/:messageId", authMiddleware, editMessage);
router.get("/search", authMiddleware, searchChats);
router.put("/:chatId/messages/:messageId/seen", authMiddleware, markAsSeen);
router.delete("/clear-history", authMiddleware, clearChatHistory);

module.exports = router;