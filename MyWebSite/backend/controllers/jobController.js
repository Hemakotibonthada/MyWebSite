// backend/controllers/jobController.js

const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const User = require('../models/User');

// ====================== CONTROLLER FUNCTIONS ======================

// Fetch All Job Listings
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'firstName lastName email');
        res.status(200).json({
            success: true,
            message: "Job listings fetched successfully.",
            jobs,
        });
    } catch (error) {
        console.error(`Error fetching job listings: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch a Job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('postedBy', 'firstName lastName email');
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        res.status(200).json({
            success: true,
            message: "Job fetched successfully.",
            job,
        });
    } catch (error) {
        console.error(`Error fetching job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Post a New Job
const postJob = async (req, res) => {
    const { title, description, type, location, salary, requirements } = req.body;
    try {
        if (!title || !description || !type || !location || !salary) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newJob = new Job({
            jobId: `JOB-${uuidv4()}`,
            title,
            description,
            type,
            location,
            salary,
            requirements,
            postedBy: req.user.id,
        });

        await newJob.save();
        res.status(201).json({
            success: true,
            message: "Job posted successfully.",
            job: newJob,
        });
    } catch (error) {
        console.error(`Error posting job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Job Details
const updateJob = async (req, res) => {
    const { title, description, type, location, salary, requirements } = req.body;
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        // Authorization
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this job." });
        }

        // Update fields if provided
        job.title = title || job.title;
        job.description = description || job.description;
        job.type = type || job.type;
        job.location = location || job.location;
        job.salary = salary || job.salary;
        job.requirements = requirements || job.requirements;

        await job.save();
        res.status(200).json({ success: true, message: "Job updated successfully.", job });
    } catch (error) {
        console.error(`Error updating job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete a Job Permanently
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: "Job not found." });

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this job." });
        }

        await job.deleteOne();
        res.status(200).json({ success: true, message: "Job deleted successfully." });
    } catch (error) {
        console.error(`Error deleting job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Soft Delete a Job
const softDeleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.jobId, { isDeleted: true }, { new: true });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        res.status(200).json({ success: true, message: "Job soft-deleted successfully.", job });
    } catch (error) {
        console.error(`Error soft-deleting job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Restore a Soft-Deleted Job
const restoreJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.jobId, { isDeleted: false }, { new: true });
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }
        res.status(200).json({ success: true, message: "Job restored successfully.", job });
    } catch (error) {
        console.error(`Error restoring job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Apply for a Job
const applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        job.applicants.push(req.user.id);
        await job.save();

        res.status(200).json({ success: true, message: "Job application submitted successfully." });
    } catch (error) {
        console.error(`Error applying for job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    postJob,
    updateJob,
    deleteJob,
    softDeleteJob,
    restoreJob,
    applyForJob,
};