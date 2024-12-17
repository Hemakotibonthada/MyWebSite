// frontend/src/components/NotificationIcon.js

import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/NotificationIcon.css";

const NotificationIcon = () => {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Mock notifications data
    useEffect(() => {
        const fetchNotifications = () => {
            const mockData = [
                { id: 1, message: "New course 'React Basics' is available.", time: "2m ago" },
                { id: 2, message: "You have a new message from John.", time: "10m ago" },
                { id: 3, message: "IoT device data updated successfully.", time: "30m ago" },
                { id: 4, message: "Your job application has been viewed.", time: "1h ago" },
            ];
            setNotifications(mockData);
        };

        fetchNotifications();
    }, []);

    // Handle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="notification-icon" ref={dropdownRef}>
            <div className="icon-container" onClick={toggleDropdown}>
                <i className="fas fa-bell"></i>
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </div>

            {isDropdownOpen && (
                <div className="notification-dropdown">
                    <h3>Notifications</h3>
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className="notification-item">
                                <p>{notif.message}</p>
                                <span>{notif.time}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-notifications">No new notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;