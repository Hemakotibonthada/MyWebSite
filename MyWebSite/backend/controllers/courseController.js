// backend/controllers/courseController.js

const Course = require('../models/Course');

// Fetch All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            courses,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch a Single Course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            course,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Create a New Course
exports.createCourse = async (req, res) => {
    const { title, description, modules } = req.body;

    try {
        // Input Validation
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        // Create Course
        const newCourse = new Course({
            title,
            description,
            modules: modules || [], // Optional modules
            createdBy: req.user.id,
        });

        await newCourse.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update a Course
exports.updateCourse = async (req, res) => {
    const { title, description, modules } = req.body;

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check ownership (Optional)
        if (course.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized to update this course" });
        }

        // Update Fields
        course.title = title || course.title;
        course.description = description || course.description;
        if (modules) course.modules = modules;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete a Course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Check ownership (Optional)
        if (course.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized to delete this course" });
        }

        await course.remove();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};