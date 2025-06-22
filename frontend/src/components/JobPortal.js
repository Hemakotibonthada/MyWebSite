// frontend/src/components/JobPortal.js

import React, { useEffect, useState } from "react";
import "../assets/styles/JobPortal.css";

const JobPortal = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    // Mock job data
    useEffect(() => {
        const fetchJobs = async () => {
            const mockJobs = [
                {
                    id: 1,
                    title: "Full-Stack Developer",
                    company: "Tech Solutions Inc.",
                    location: "Remote",
                    type: "Full-Time",
                    category: "Development",
                    description: "Develop and maintain full-stack web applications.",
                },
                {
                    id: 2,
                    title: "IoT Engineer",
                    company: "SmartTech",
                    location: "On-Site",
                    type: "Part-Time",
                    category: "IoT",
                    description: "Work on IoT devices and real-time dashboards.",
                },
                {
                    id: 3,
                    title: "AI/ML Specialist",
                    company: "AI Innovators",
                    location: "Hybrid",
                    type: "Full-Time",
                    category: "AI/ML",
                    description: "Develop machine learning models and AI solutions.",
                },
                {
                    id: 4,
                    title: "UI/UX Designer",
                    company: "DesignWorks",
                    location: "Remote",
                    type: "Contract",
                    category: "Design",
                    description: "Design user interfaces and enhance user experiences.",
                },
            ];

            setJobs(mockJobs);
            setFilteredJobs(mockJobs);
        };

        fetchJobs();
    }, []);

    // Search and filter logic
    useEffect(() => {
        let filtered = jobs.filter(
            (job) =>
                job.title.toLowerCase().includes(search.toLowerCase()) &&
                (category === "All" || job.category === category)
        );
        setFilteredJobs(filtered);
    }, [search, category, jobs]);

    return (
        <div className="job-portal">
            <header className="portal-header">
                <h1>Job Portal</h1>
                <p>Find the best opportunities that match your skills and interests.</p>
            </header>

            <div className="job-controls">
                <input
                    type="text"
                    placeholder="Search job titles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Development">Development</option>
                    <option value="IoT">IoT</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Design">Design</option>
                </select>
            </div>

            <div className="job-list">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="job-card">
                            <h3>{job.title}</h3>
                            <p>
                                <strong>Company:</strong> {job.company}
                            </p>
                            <p>
                                <strong>Location:</strong> {job.location}
                            </p>
                            <p>
                                <strong>Type:</strong> {job.type}
                            </p>
                            <p>{job.description}</p>
                            <button className="apply-btn">Apply Now</button>
                        </div>
                    ))
                ) : (
                    <p className="no-jobs">No jobs found matching your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default JobPortal;