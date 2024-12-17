const Course = require('../models/Course');

// Fetch All Courses
exports.getCourses = async (req, res) => {
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
        const course = await Course.findById(req.params.courseId);

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
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newCourse = new Course({
            title,
            description,
            modules: modules || [],
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
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized to update this course" });
        }

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
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized to delete this course" });
        }

        await course.remove();

        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Enroll a User in a Course
exports.enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (!course.enrolledStudents.includes(req.user.id)) {
            course.enrolledStudents.push(req.user.id);
            await course.save();
        }

        res.status(200).json({ success: true, message: "Enrolled successfully", course });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Rate a Course
exports.rateCourse = async (req, res) => {
    const { rating } = req.body;

    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        course.ratings.push({ userId: req.user.id, rating });
        await course.save();

        res.status(200).json({ success: true, message: "Course rated successfully", course });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Add a Comment to a Module
exports.addCommentToModule = async (req, res) => {
    const { comment } = req.body;

    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: "Module not found" });

        module.comments.push({ userId: req.user.id, comment });
        await course.save();

        res.status(200).json({ success: true, message: "Comment added successfully", module });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch Course Modules
exports.fetchCourseModules = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        res.status(200).json({ success: true, modules: course.modules });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch Comments for Course Modules
exports.fetchCourseComments = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const comments = course.modules.flatMap((module) => module.comments);

        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update a Module in a Course
exports.updateModule = async (req, res) => {
    const { title, type, contentUrl } = req.body;

    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const module = course.modules.id(req.params.moduleId);
        if (!module) return res.status(404).json({ message: "Module not found" });

        // Update module fields
        module.title = title || module.title;
        module.type = type || module.type;
        module.contentUrl = contentUrl || module.contentUrl;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Module updated successfully",
            module,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Delete a Module from a Course
exports.deleteModule = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Find the module to delete
        const moduleIndex = course.modules.findIndex(
            (module) => module._id.toString() === req.params.moduleId
        );

        if (moduleIndex === -1) {
            return res.status(404).json({ success: false, message: "Module not found" });
        }

        // Remove the module from the array
        course.modules.splice(moduleIndex, 1);

        // Save the updated course
        await course.save();

        res.status(200).json({
            success: true,
            message: "Module deleted successfully",
            modules: course.modules,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};