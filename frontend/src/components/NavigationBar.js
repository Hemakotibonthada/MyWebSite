// frontend/src/components/NavigationBar.js

import React, { useState } from "react";
import NotificationIcon from "./NotificationIcon";
import "../assets/styles/NavigationBar.css";
import { Link } from "react-router-dom";

const NavigationBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navigation-bar">
            <div className="nav-logo">
                <Link to="/">MyWebSite</Link>
            </div>
            <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/courses">Courses</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat Room</Link>
                    </li>
                    <li>
                        <Link to="/jobs">Job Portal</Link>
                    </li>
                    <li>
                        <Link to="/social">Social Life</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                            <li><NotificationIcon /></li>
                </ul>
            </nav>
            <div className="menu-icon" onClick={toggleMenu}>
                <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </div>
        </header>
    );
};

export default NavigationBar;