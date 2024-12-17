// backend/routes/deviceRoutes.js

const express = require("express");
const router = express.Router();
const {
    getDevices,
    addDevice,
    removeDevice,
    controlDevice,
    fetchDeviceData,
    addComponent,
    updateComponent,
    removeComponent,
    getComponents,
} = require("../controllers/deviceController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// ====================== DEVICE ROUTES ======================

// @route   GET /api/devices
// @desc    Fetch all devices for a user
// @access  Private
router.get("/", authMiddleware, getDevices);

// @route   POST /api/devices
// @desc    Add a new device
// @access  Private
router.post("/", authMiddleware, addDevice);

// @route   DELETE /api/devices/:serialNumber
// @desc    Remove a device by serial number
// @access  Private
router.delete("/:serialNumber", authMiddleware, removeDevice);

// @route   POST /api/devices/:serialNumber/control
// @desc    Control a device (turn ON/OFF)
// @access  Private
router.post("/:serialNumber/control", authMiddleware, controlDevice);

// @route   GET /api/devices/:serialNumber/data
// @desc    Fetch real-time temperature and humidity data from a device
// @access  Private
router.get("/:serialNumber/data", authMiddleware, fetchDeviceData);

// ====================== COMPONENT ROUTES ======================

// @route   POST /api/devices/:serialNumber/components
// @desc    Add a component (e.g., switch, button, sensor) to a device
// @access  Private
router.post("/:serialNumber/components", authMiddleware, addComponent);

// @route   PUT /api/devices/:serialNumber/components/:componentId
// @desc    Update a component's information
// @access  Private
router.put("/:serialNumber/components/:componentId", authMiddleware, updateComponent);

// @route   DELETE /api/devices/:serialNumber/components/:componentId
// @desc    Remove a component by ID from a device
// @access  Private
router.delete("/:serialNumber/components/:componentId", authMiddleware, removeComponent);

// @route   GET /api/devices/:serialNumber/components
// @desc    Fetch all components for a device
// @access  Private
router.get("/:serialNumber/components", authMiddleware, getComponents);

// ====================== EXPORT ROUTER ======================
module.exports = router;