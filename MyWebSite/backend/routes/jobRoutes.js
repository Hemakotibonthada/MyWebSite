// backend/routes/jobRoutes.js

const express = require("express");
const router = express.Router();
const {
    getAllJobs,
    getJobById,
    postJob,
    updateJob,
    deleteJob,
} = require("../controllers/jobController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== JOB ROUTES ======================

// @route   GET /api/jobs
// @desc    Fetch all job listings
// @access  Public
router.get("/", getAllJobs);

// @route   GET /api/jobs/:jobId
// @desc    Fetch a single job by ID
// @access  Public
router.get("/:jobId", getJobById);

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
router.post("/", authMiddleware, postJob);

// @route   PUT /api/jobs/:jobId
// @desc    Update a job
// @access  Private
router.put("/:jobId", authMiddleware, updateJob);

// @route   DELETE /api/jobs/:jobId
// @desc    Delete a job permanently
// @access  Private
router.delete("/:jobId", authMiddleware, deleteJob);

// ====================== EXPORT ROUTER ======================
module.exports = router;