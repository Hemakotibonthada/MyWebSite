// backend/controllers/jobController.js

const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const User = require('../models/User');

exports.postJob = async (req, res) => {
    const { title, description, type, location, salary, requirements } = req.body;

    try {
        const newJob = new Job({
            jobId: `JOB-${uuidv4()}`, // Generate Job ID here
            title,
            description,
            type,
            location,
            salary,
            requirements,
            postedBy: req.user.id,
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Job posted successfully.", job: newJob });
    } catch (error) {
        console.error(`Error posting job: ${error.message}`);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch All Job Listings
exports.getAllJobs = async (req, res) => {
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

// Fetch Job By ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'firstName lastName email');

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
exports.postJob = async (req, res) => {
    const { title, description, type, location, salary, requirements } = req.body;

    try {
        // Input Validation
        if (!title || !description || !type || !location || !salary) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newJob = new Job({
            title,
            description,
            type, // Full-Time, Part-Time, Freelance
            location,
            salary,
            requirements,
            postedBy: req.user.id, // User who posts the job
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

// Apply for a Job
exports.applyJob = async (req, res) => {
    const { jobId } = req.body;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        job.applicants.push(req.user.id);
        await job.save();

        res.status(200).json({
            success: true,
            message: "Job application submitted successfully.",
        });
    } catch (error) {
        console.error(`Error applying for job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch Applicants for a Job
exports.getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('applicants', 'firstName lastName email');

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to view applicants for this job." });
        }

        res.status(200).json({
            success: true,
            message: "Job applicants fetched successfully.",
            applicants: job.applicants,
        });
    } catch (error) {
        console.error(`Error fetching job applicants: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete a Job Post
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to delete this job." });
        }

        await job.remove();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully.",
        });
    } catch (error) {
        console.error(`Error deleting job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};