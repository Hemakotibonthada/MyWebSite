// frontend/src/components/CoursesPage.js

import React, { useEffect, useState } from "react";
import { fetchCourses } from "../utils/apiService";
import "../assets/styles/CoursesPage.css";
import CourseCard from "./CourseCard";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                setError("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };

        getCourses();
    }, []);

    return (
        <div className="courses-page">
            <header className="courses-header">
                <h1>Available Courses</h1>
                <p>Explore a variety of courses to enhance your skills and knowledge.</p>
            </header>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="courses-container">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <p className="no-courses">No courses available at this time.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CoursesPage;