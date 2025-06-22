// backend/routes/jobRoutes.js

const express = require("express");
const router = express.Router();
const {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    softDeleteJob,
    restoreJob,
    applyForJob,
    fetchApplicants,
    updateApplicationStatus,
    fetchUserApplications,
    checkJobExpiration,
} = require("../controllers/jobController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== JOB ROUTES ======================

// @route   GET /api/jobs
// @desc    Fetch all jobs
// @access  Public
router.get("/", getJobs);

// @route   GET /api/jobs/:jobId
// @desc    Fetch a single job by ID
// @access  Public
router.get("/:jobId", getJobById);

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private
router.post("/", authMiddleware, createJob);

// @route   PUT /api/jobs/:jobId
// @desc    Update a job's details
// @access  Private
router.put("/:jobId", authMiddleware, updateJob);

// @route   DELETE /api/jobs/:jobId
// @desc    Permanently delete a job posting
// @access  Private
router.delete("/:jobId", authMiddleware, deleteJob);

// @route   POST /api/jobs/:jobId/soft-delete
// @desc    Soft delete a job
// @access  Private
router.post("/:jobId/soft-delete", authMiddleware, softDeleteJob);

// @route   POST /api/jobs/:jobId/restore
// @desc    Restore a soft-deleted job
// @access  Private
router.post("/:jobId/restore", authMiddleware, restoreJob);

// ====================== JOB APPLICATION ROUTES ======================

// @route   POST /api/jobs/:jobId/apply
// @desc    Apply for a job
// @access  Private
router.post("/:jobId/apply", authMiddleware, applyForJob);

// @route   GET /api/jobs/:jobId/applicants
// @desc    Fetch all applicants for a job
// @access  Private
router.get("/:jobId/applicants", authMiddleware, fetchApplicants);

// @route   PUT /api/jobs/:jobId/applicants/:applicantId/status
// @desc    Update job application status (Accepted/Rejected/Pending)
// @access  Private
router.put(
    "/:jobId/applicants/:applicantId/status",
    authMiddleware,
    updateApplicationStatus
);

// @route   GET /api/jobs/applications
// @desc    Fetch all jobs a user has applied to
// @access  Private
router.get("/applications", authMiddleware, fetchUserApplications);

// ====================== JOB EXPIRATION ROUTE ======================

// @route   GET /api/jobs/:jobId/expiration
// @desc    Check if a job posting is expired
// @access  Public
router.get("/:jobId/expiration", checkJobExpiration);

// ====================== EXPORT ROUTER ======================
module.exports = router;