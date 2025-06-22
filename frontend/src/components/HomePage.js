// frontend/src/components/HomePage.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/HomePage.css";

const HomePage = () => {
    const { user, logout } = useAuth();
    const [greeting, setGreeting] = useState("");
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Dynamic Greeting Based on Time of Day
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting("Good Morning");
        } else if (currentHour < 18) {
            setGreeting("Good Afternoon");
        } else {
            setGreeting("Good Evening");
        }

        // Simulate Fetch Notifications
        setNotifications([
            "New course added: IoT Device Management",
            "Your job application has been viewed",
            "Join the Chat Room for the latest updates",
        ]);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>
                    {greeting}, {user?.firstName || "User"}!
                </h1>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <section className="notifications">
                <h2>Notifications</h2>
                <ul>
                    {notifications.map((note, index) => (
                        <li key={index}>{note}</li>
                    ))}
                </ul>
            </section>

            <section className="features">
                <h2>Explore Features</h2>
                <div className="feature-cards">
                    <Link to="/dashboard" className="feature-card">
                        <h3>Device Dashboard</h3>
                        <p>Control and monitor your IoT devices.</p>
                    </Link>
                    <Link to="/courses" className="feature-card">
                        <h3>Learning Portal</h3>
                        <p>Explore and enroll in interactive courses.</p>
                    </Link>
                    <Link to="/chat" className="feature-card">
                        <h3>Chat Rooms</h3>
                        <p>Connect with other users in real time.</p>
                    </Link>
                    <Link to="/jobs" className="feature-card">
                        <h3>Job Portal</h3>
                        <p>Find and apply for jobs that match your skills.</p>
                    </Link>
                </div>
            </section>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} MyWebSite. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;