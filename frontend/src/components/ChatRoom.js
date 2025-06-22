// frontend/src/components/ChatRoom.js

import React, { useEffect, useState, useRef } from "react";
import "../assets/styles/ChatRoom.css";

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState(["User1", "User2", "User3"]);
    const messageEndRef = useRef(null);

    // Simulated WebSocket Connection for Real-time Messaging
    useEffect(() => {
        // Simulate fetching initial messages
        const fetchMessages = async () => {
            setMessages([
                { id: 1, sender: "User1", text: "Hello! 👋", time: "10:00 AM" },
                { id: 2, sender: "You", text: "Hi! How are you?", time: "10:01 AM" },
            ]);
        };

        fetchMessages();
    }, []);

    // Scroll to the latest message
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle Message Input
    const handleMessageInput = (e) => {
        setInputMessage(e.target.value);
    };

    // Send Message
    const handleSendMessage = () => {
        if (inputMessage.trim() === "") return;

        const newMessage = {
            id: messages.length + 1,
            sender: "You",
            text: inputMessage,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages([...messages, newMessage]);
        setInputMessage("");

        // Simulate Response from Server/User
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    sender: "User1",
                    text: "That's great to hear!",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
            ]);
        }, 1000);
    };

    return (
        <div className="chatroom-container">
            <div className="chatroom-header">
                <h2>Chat Room</h2>
                <span>{onlineUsers.length} Users Online</span>
            </div>

            <div className="chatroom-content">
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`message ${msg.sender === "You" ? "sent" : "received"}`}
                        >
                            <div className="message-sender">{msg.sender}</div>
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">{msg.time}</div>
                        </div>
                    ))}
                    <div ref={messageEndRef}></div>
                </div>
            </div>

            <div className="chatroom-input">
                <input
                    type="text"
                    placeholder="Type your message here..."
                    value={inputMessage}
                    onChange={handleMessageInput}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;