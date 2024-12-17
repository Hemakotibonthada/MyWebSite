// frontend/src/components/Footer.js

import React from "react";
import "../assets/styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-links">
                    <a href="/about">About Us</a>
                    <a href="/careers">Careers</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                </div>
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} MyWebSite. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;