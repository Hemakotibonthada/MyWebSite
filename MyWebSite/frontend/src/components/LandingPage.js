// frontend/src/components/LandingPage.js

import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/LandingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to MyWebSite</h1>
                    <p>
                        Your all-in-one platform for IoT device control, interactive courses,
                        real-time chats, and career opportunities.
                    </p>
                    <Link to="/signup" className="btn-primary">
                        Get Started
                    </Link>
                </div>
                <div className="hero-image">
                    <img
                        src="/assets/images/landing-hero.png"
                        alt="Hero Section"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Explore Our Features</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <img
                            src="/assets/images/iot-control.png"
                            alt="IoT Control"
                        />
                        <h3>IoT Device Control</h3>
                        <p>Manage and monitor your IoT devices seamlessly.</p>
                    </div>
                    <div className="feature-card">
                        <img
                            src="/assets/images/learning-portal.png"
                            alt="Learning Portal"
                        />
                        <h3>Learning Portal</h3>
                        <p>Access interactive courses and upskill effectively.</p>
                    </div>
                    <div className="feature-card">
                        <img
                            src="/assets/images/chat-room.png"
                            alt="Chat Room"
                        />
                        <h3>Real-Time Chat Rooms</h3>
                        <p>Connect with peers and collaborate in real time.</p>
                    </div>
                    <div className="feature-card">
                        <img
                            src="/assets/images/job-portal.png"
                            alt="Job Portal"
                        />
                        <h3>Job Opportunities</h3>
                        <p>Find, apply for jobs, or post job openings easily.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta">
                <h2>Join Us Today</h2>
                <p>
                    Sign up now to experience the best tools for IoT, learning,
                    communication, and career management.
                </p>
                <Link to="/signup" className="btn-primary">
                    Sign Up
                </Link>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/careers">Careers</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} MyWebSite. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;