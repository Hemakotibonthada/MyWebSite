// backend/models/Device.js

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for components

// Component Schema: Represents a Switch, Button, or any component within the device
const componentSchema = new mongoose.Schema({
    componentId: {
        type: String,
        default: uuidv4, // Auto-generate a unique ID for each component
    },
    name: {
        type: String,
        required: [true, "Component name is required"],
        trim: true,
    },
    type: {
        type: String,
        enum: ["Switch", "Button", "Sensor", "Graph"],
        required: [true, "Component type is required"],
    },
    state: {
        type: String,
        enum: ["ON", "OFF"],
        default: "OFF",
    },
    additionalInfo: {
        type: Object, // Flexible field for extra data (e.g., graph settings)
        default: {},
    },
});

// Device Schema
const deviceSchema = new mongoose.Schema(
    {
        serialNumber: {
            type: String,
            required: [true, "Serial number is required"],
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "Device name is required"],
            trim: true,
        },
        model: {
            type: String,
            required: [true, "Device model is required"],
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Error"],
            default: "Inactive",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        components: [componentSchema], // Array of components with unique IDs
        temperature: {
            type: Number,
            default: null,
        },
        humidity: {
            type: Number,
            default: null,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Pre-save hook to trim data
deviceSchema.pre("save", function (next) {
    this.serialNumber = this.serialNumber.trim();
    this.name = this.name.trim();
    next();
});

// Export Device Model
module.exports = mongoose.model("Device", deviceSchema);