// backend/models/Course.js

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// Schema for Course Modules (e.g., Videos, PDFs, Articles)
const moduleSchema = new mongoose.Schema({
    moduleId: {
        type: String,
        default: uuidv4, // Auto-generate unique ID for each module
        unique: true,
    },
    title: {
        type: String,
        required: [true, "Module title is required"],
        trim: true,
    },
    type: {
        type: String,
        enum: ["Video", "PDF", "Article"],
        required: [true, "Module type is required"],
    },
    contentUrl: {
        type: String,
        required: [true, "Content URL is required"],
    },
    duration: {
        type: String, // For video modules (e.g., "15:30" for 15 minutes 30 seconds)
        default: null,
    },
    description: {
        type: String,
        trim: true,
    },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, min: 1, max: 5, required: true },
        },
    ],
    completionStatus: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            completedAt: { type: Date, default: Date.now },
        },
    ],
});

// Schema for Course
const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            default: () => `COURSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Course description is required"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["Development", "Design", "Marketing", "IoT", "AI/ML", "Other"],
            required: [true, "Course category is required"],
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        published: {
            type: Boolean,
            default: false, // Draft status by default
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        modules: [moduleSchema], // Array of course modules
        enrolledStudents: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                enrolledAt: { type: Date, default: Date.now },
                progress: {
                    type: Number, // Course progress percentage
                    default: 0,
                },
            },
        ],
        prerequisites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Pre-save Hook to Ensure Course ID
courseSchema.pre("save", function (next) {
    if (!this.courseId) {
        this.courseId = `COURSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

// Method to Calculate Average Ratings
courseSchema.methods.calculateAverageRating = function () {
    const totalRatings = this.modules.reduce((total, module) => {
        return total + module.ratings.reduce((sum, r) => sum + r.rating, 0);
    }, 0);

    const ratingCount = this.modules.reduce((total, module) => {
        return total + module.ratings.length;
    }, 0);

    this.averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
    this.totalRatings = ratingCount;
};

// Method to Update Module Completion for a User
courseSchema.methods.markModuleComplete = function (userId, moduleId) {
    const module = this.modules.id(moduleId);
    if (module) {
        const alreadyCompleted = module.completionStatus.some(
            (status) => status.userId.toString() === userId
        );
        if (!alreadyCompleted) {
            module.completionStatus.push({ userId });
            return true;
        }
    }
    return false;
};

module.exports = mongoose.model("Course", courseSchema);