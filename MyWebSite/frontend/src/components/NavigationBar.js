import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationIcon from "./NotificationIcon";
import "../assets/styles/NavigationBar.css";
//import "@fortawesome/fontawesome-free/css/all.min.css"; // Uncomment to use FontAwesome icons

const NavigationBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to toggle the menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navigation-bar">
            <div className="nav-logo">
                <Link to="/" className="logo-link">
                    MyWebSite
                </Link>
            </div>

            {/* Navbar Links */}
            <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                <ul>
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                    <li><Link to="/courses" className="nav-link">Courses</Link></li>
                    <li><Link to="/chat" className="nav-link">Chat Room</Link></li>
                    <li><Link to="/jobs" className="nav-link">Job Portal</Link></li>
                    <li><Link to="/social" className="nav-link">Social Life</Link></li>
                    <li><Link to="/profile" className="nav-link">Profile</Link></li>
                    <li><NotificationIcon /></li>
                </ul>
            </nav>

            {/* Menu Icon for Mobile View */}
            <div className="menu-icon" onClick={toggleMenu}>
                <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </div>
        </header>
    );
};

export default NavigationBar;