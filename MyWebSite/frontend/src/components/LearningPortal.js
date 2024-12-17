// frontend/src/components/LearningPortal.js

import React, { useEffect, useState } from "react";
import "../assets/styles/LearningPortal.css";
import { fetchCourses } from "../utils/apiService";
import CourseCard from "./CourseCard";

const LearningPortal = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };

        getCourses();
    }, []);

    if (loading) return <div className="loader">Loading courses...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="learning-portal">
            <header className="portal-header">
                <h1>Learning Portal</h1>
                <p>Explore courses to upskill and achieve your goals.</p>
            </header>

            <div className="courses-container">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <p className="no-courses">No courses available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default LearningPortal;