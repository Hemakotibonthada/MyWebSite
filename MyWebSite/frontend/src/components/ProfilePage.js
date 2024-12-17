// frontend/src/components/ProfilePage.js

import React, { useState } from "react";
import "../assets/styles/ProfilePage.css";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("about");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const profileData = {
        name: "John Doe",
        role: "Full-Stack Developer | IoT Enthusiast",
        bio: "I am a passionate software engineer with 5+ years of experience specializing in full-stack development, IoT solutions, and building scalable cloud applications.",
        contact: {
            email: "john.doe@example.com",
            phone: "+123-456-7890",
            website: "www.johndoe.dev",
            linkedin: "linkedin.com/in/johndoe",
            github: "github.com/johndoe",
        },
        skills: [
            "React",
            "Node.js",
            "JavaScript",
            "MongoDB",
            "IoT Solutions",
            "Cloud Computing",
            "Python",
            "Machine Learning",
        ],
        experience: [
            {
                company: "Tech Solutions Inc.",
                role: "Senior Full-Stack Developer",
                duration: "2021 - Present",
                description: "Built and maintained scalable web applications and IoT platforms for smart cities.",
            },
            {
                company: "InnovateX",
                role: "IoT Developer",
                duration: "2018 - 2021",
                description: "Developed IoT-based energy monitoring systems integrated with cloud services.",
            },
        ],
        projects: [
            { name: "Smart Home Controller", description: "Built an IoT dashboard to control home appliances." },
            { name: "AI-Based Recommendation System", description: "Implemented an ML model to recommend products." },
            { name: "Portfolio Website", description: "Developed a responsive personal portfolio website using React." },
        ],
    };

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <header className="profile-header">
                <div className="profile-avatar">
                    <img src="/assets/images/profile.jpg" alt="Profile Avatar" />
                </div>
                <div className="profile-details">
                    <h1>{profileData.name}</h1>
                    <p>{profileData.role}</p>
                    <p>{profileData.bio}</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="profile-nav">
                <ul>
                    <li
                        className={activeTab === "about" ? "active" : ""}
                        onClick={() => handleTabChange("about")}
                    >
                        About
                    </li>
                    <li
                        className={activeTab === "skills" ? "active" : ""}
                        onClick={() => handleTabChange("skills")}
                    >
                        Skills
                    </li>
                    <li
                        className={activeTab === "experience" ? "active" : ""}
                        onClick={() => handleTabChange("experience")}
                    >
                        Experience
                    </li>
                    <li
                        className={activeTab === "projects" ? "active" : ""}
                        onClick={() => handleTabChange("projects")}
                    >
                        Projects
                    </li>
                    <li
                        className={activeTab === "contact" ? "active" : ""}
                        onClick={() => handleTabChange("contact")}
                    >
                        Contact
                    </li>
                </ul>
            </nav>

            {/* Content Sections */}
            <section className="profile-content">
                {activeTab === "about" && (
                    <div className="about-section">
                        <h2>About Me</h2>
                        <p>{profileData.bio}</p>
                    </div>
                )}

                {activeTab === "skills" && (
                    <div className="skills-section">
                        <h2>Skills</h2>
                        <ul className="skills-list">
                            {profileData.skills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === "experience" && (
                    <div className="experience-section">
                        <h2>Work Experience</h2>
                        {profileData.experience.map((job, index) => (
                            <div key={index} className="job-card">
                                <h3>{job.company}</h3>
                                <p>
                                    <strong>{job.role}</strong> | {job.duration}
                                </p>
                                <p>{job.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "projects" && (
                    <div className="projects-section">
                        <h2>Projects</h2>
                        {profileData.projects.map((project, index) => (
                            <div key={index} className="project-card">
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "contact" && (
                    <div className="contact-section">
                        <h2>Contact Information</h2>
                        <ul>
                            <li>Email: {profileData.contact.email}</li>
                            <li>Phone: {profileData.contact.phone}</li>
                            <li>Website: {profileData.contact.website}</li>
                            <li>LinkedIn: {profileData.contact.linkedin}</li>
                            <li>GitHub: {profileData.contact.github}</li>
                        </ul>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;