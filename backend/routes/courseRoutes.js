// backend/routes/courseRoutes.js

const express = require("express");
const router = express.Router();
const {
    getAllCourses, // <-- use this
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    rateCourse,
    addModule,
    updateModule,
    deleteModule,
    addCommentToModule,
    fetchCourseModules,
    fetchCourseComments,
} = require("../controllers/courseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== COURSE ROUTES ======================

// @route   GET /api/courses
// @desc    Fetch all courses
// @access  Public
router.get("/", getAllCourses);

// @route   GET /api/courses/:courseId
// @desc    Fetch a single course by ID
// @access  Public
router.get("/:courseId", getCourseById);

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private
router.post("/", authMiddleware, createCourse);

// @route   PUT /api/courses/:courseId
// @desc    Update a course's details
// @access  Private
router.put("/:courseId", authMiddleware, updateCourse);

// @route   DELETE /api/courses/:courseId
// @desc    Delete a course
// @access  Private
router.delete("/:courseId", authMiddleware, deleteCourse);

// ====================== ENROLLMENT AND RATING ======================

// @route   POST /api/courses/:courseId/enroll
// @desc    Enroll a user in a course
// @access  Private
router.post("/:courseId/enroll", authMiddleware, enrollCourse);

// @route   POST /api/courses/:courseId/rate
// @desc    Rate a course
// @access  Private
router.post("/:courseId/rate", authMiddleware, rateCourse);

// ====================== COURSE MODULES ======================

// @route   GET /api/courses/:courseId/modules
// @desc    Fetch all modules for a course
// @access  Public
router.get("/:courseId/modules", fetchCourseModules);

// @route   POST /api/courses/:courseId/modules
// @desc    Add a new module to a course
// @access  Private
router.post("/:courseId/modules", authMiddleware, addModule);

// @route   PUT /api/courses/:courseId/modules/:moduleId
// @desc    Update a module
// @access  Private
router.put("/:courseId/modules/:moduleId", authMiddleware, updateModule);

// @route   DELETE /api/courses/:courseId/modules/:moduleId
// @desc    Delete a module from a course
// @access  Private
router.delete("/:courseId/modules/:moduleId", authMiddleware, deleteModule);

// ====================== MODULE COMMENTS ======================

// @route   POST /api/courses/:courseId/modules/:moduleId/comments
// @desc    Add a comment to a module
// @access  Private
router.post(
    "/:courseId/modules/:moduleId/comments",
    authMiddleware,
    addCommentToModule
);

// @route   GET /api/courses/:courseId/comments
// @desc    Fetch all comments for a course's modules
// @access  Public
router.get("/:courseId/comments", fetchCourseComments);

// ====================== EXPORT ROUTER ======================
module.exports = router;