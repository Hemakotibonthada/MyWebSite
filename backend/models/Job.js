// backend/models/Job.js

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Schema for Job Applications
const applicationSchema = new mongoose.Schema({
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, trim: true },
    appliedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
});

// Main Schema for Jobs
const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            default: () => `JOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Job location is required"],
            trim: true,
        },
        salary: {
            type: Number,
            default: null,
        },
        jobType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Freelance"],
            required: true,
        },
        skillsRequired: [
            {
                type: String,
                trim: true,
            },
        ],
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Open", "Closed", "Pending"],
            default: "Open",
        },
        deadline: {
            type: Date,
            required: [true, "Job deadline is required"],
        },
        applications: [applicationSchema], // Array to track job applications
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        deletedAt: {
            type: Date,
            default: null, // Soft delete field
        },
    },
    { timestamps: true }
);

// ===================== METHODS =====================

// Add a New Job Application
jobSchema.methods.addApplication = function (applicationData) {
    const existingApplicant = this.applications.find(
        (app) => app.applicantId.toString() === applicationData.applicantId.toString()
    );

    if (existingApplicant) {
        throw new Error("User has already applied for this job.");
    }

    this.applications.push(applicationData);
    return this;
};

// Update Job Status
jobSchema.methods.updateJobStatus = function (newStatus) {
    if (["Open", "Closed", "Pending"].includes(newStatus)) {
        this.status = newStatus;
        this.updatedAt = Date.now();
    } else {
        throw new Error("Invalid job status.");
    }
};

// Soft Delete a Job
jobSchema.methods.softDelete = function () {
    this.deletedAt = new Date();
    this.status = "Closed";
    return this;
};

// Restore a Soft Deleted Job
jobSchema.methods.restoreJob = function () {
    this.deletedAt = null;
    this.status = "Open";
    return this;
};

// Check if Job is Expired
jobSchema.methods.isExpired = function () {
    return new Date() > this.deadline;
};

// ===================== PRE-SAVE HOOK =====================

// Automatically Update the `updatedAt` Timestamp
jobSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

// ===================== MODEL EXPORT =====================
module.exports = mongoose.model("Job", jobSchema);