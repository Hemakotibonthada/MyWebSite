// frontend/src/components/CourseCard.js

import React, { useState } from "react";
import "../assets/styles/CourseCard.css";

const CourseCard = ({ course }) => {
    const [enrolled, setEnrolled] = useState(false);
    const [rating, setRating] = useState(course.rating || 0);

    const handleEnroll = () => {
        setEnrolled(true);
        alert(`You have enrolled in "${course.title}"!`);
    };

    const handleRating = (rate) => {
        setRating(rate);
        alert(`You rated "${course.title}" with ${rate} stars.`);
    };

    return (
        <div className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-details">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-footer">
                    <span>Category: {course.category}</span>
                    {!enrolled ? (
                        <button className="enroll-btn" onClick={handleEnroll}>
                            Enroll
                        </button>
                    ) : (
                        <span className="enrolled-badge">Enrolled</span>
                    )}
                </div>
                <div className="course-rating">
                    <span>Rate this Course:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`star-btn ${star <= rating ? "active" : ""}`}
                            onClick={() => handleRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;