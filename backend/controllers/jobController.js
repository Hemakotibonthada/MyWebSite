// backend/controllers/jobController.js

const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
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

// Fetch All Job Listings
exports.getJobs = async (req, res) => {
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

// Update a Job
exports.updateJob = async (req, res) => {
    const { title, description, type, location, salary, requirements } = req.body;

    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to update this job." });
        }

        // Update job details
        job.title = title || job.title;
        job.description = description || job.description;
        job.type = type || job.type;
        job.location = location || job.location;
        job.salary = salary || job.salary;
        job.requirements = requirements || job.requirements;

        await job.save();

        res.status(200).json({
            success: true,
            message: "Job updated successfully.",
            job,
        });
    } catch (error) {
        console.error(`Error updating job: ${error.message}`);
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

// Soft Delete a Job Post
exports.softDeleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to delete this job." });
        }

        job.isDeleted = true;
        await job.save();

        res.status(200).json({
            success: true,
            message: "Job soft deleted successfully.",
        });
    } catch (error) {
        console.error(`Error soft deleting job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Restore a Soft Deleted Job Post
exports.restoreJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to restore this job." });
        }

        job.isDeleted = false;
        await job.save();

        res.status(200).json({
            success: true,
            message: "Job restored successfully.",
        });
    } catch (error) {
        console.error(`Error restoring job: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Apply for a Job
exports.applyForJob = async (req, res) => {
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
exports.fetchApplicants = async (req, res) => {
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

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    const { jobId, applicantId, status } = req.body;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure the user is the job poster
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized to update application status." });
        }

        const applicantIndex = job.applicants.findIndex(applicant => applicant.toString() === applicantId);

        if (applicantIndex === -1) {
            return res.status(404).json({ message: "Applicant not found." });
        }

        // Update the application status (assuming status is a field in the applicant object)
        job.applicants[applicantIndex].status = status;

        await job.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
        });
    } catch (error) {
        console.error(`Error updating application status: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Fetch User Applications
exports.fetchUserApplications = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('applications');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User applications fetched successfully.",
            applications: user.applications,
        });
    } catch (error) {
        console.error(`Error fetching user applications: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Check Job Expiration
exports.checkJobExpiration = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        const currentDate = new Date();
        const jobExpirationDate = new Date(job.createdAt);
        jobExpirationDate.setDate(jobExpirationDate.getDate() + 30); // Assuming job expires in 30 days

        if (currentDate > jobExpirationDate) {
            return res.status(400).json({ message: "Job application period has expired." });
        }

        res.status(200).json({
            success: true,
            message: "Job is still open for applications.",
        });
    } catch (error) {
        console.error(`Error checking job expiration: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};