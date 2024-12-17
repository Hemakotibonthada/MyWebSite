// backend/controllers/deviceController.js

const Device = require('../models/Device'); // Device model
const axios = require('axios'); // To interact with ESP32 device APIs

// Fetch All Devices for a User
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find({ userId: req.user.id });

        res.status(200).json({
            success: true,
            devices,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add a New Device
exports.addDevice = async (req, res) => {
    const { serialNumber, name, model } = req.body;

    try {
        // Input Validation
        if (!serialNumber || !name || !model) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if device already exists
        const existingDevice = await Device.findOne({ serialNumber });
        if (existingDevice) {
            return res.status(400).json({ message: 'Device already registered.' });
        }

        // Add Device
        const newDevice = new Device({
            userId: req.user.id,
            serialNumber,
            name,
            model,
        });

        await newDevice.save();

        res.status(201).json({
            success: true,
            message: 'Device added successfully.',
            device: newDevice,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Remove a Device
exports.removeDevice = async (req, res) => {
    const { serialNumber } = req.params;

    try {
        // Find and Remove Device
        const device = await Device.findOneAndDelete({ serialNumber, userId: req.user.id });

        if (!device) {
            return res.status(404).json({ message: 'Device not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Device removed successfully.',
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Control a Device (Turn On/Off)
exports.controlDevice = async (req, res) => {
    const { serialNumber } = req.params;
    const { action } = req.body; // 'on' or 'off'

    try {
        // Input Validation
        if (!action || (action !== 'on' && action !== 'off')) {
            return res.status(400).json({ message: 'Invalid action. Use "on" or "off".' });
        }

        // Check Device Ownership
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) {
            return res.status(404).json({ message: 'Device not found.' });
        }

        // Simulate API Call to ESP32
        const esp32Response = await axios.post(`http://esp32-device/api/control`, {
            serialNumber,
            action,
        });

        res.status(200).json({
            success: true,
            message: `Device turned ${action} successfully.`,
            esp32Response: esp32Response.data,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Fetch Device Data (Temperature, Humidity)
exports.fetchDeviceData = async (req, res) => {
    const { serialNumber } = req.params;

    try {
        // Check Device Ownership
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) {
            return res.status(404).json({ message: 'Device not found.' });
        }

        // Simulate Fetching Data from ESP32
        const esp32Data = await axios.get(`http://esp32-device/api/data`, {
            params: { serialNumber },
        });

        res.status(200).json({
            success: true,
            message: 'Device data fetched successfully.',
            data: esp32Data.data,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// ========================== New Functionality for Components ==========================

// Add a Component (Switch/Button) to a Device
exports.addComponent = async (req, res) => {
    const { serialNumber } = req.params;
    const { name, type, state, additionalInfo } = req.body;

    try {
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) return res.status(404).json({ message: "Device not found." });

        const newComponent = {
            name,
            type,
            state: state || "OFF",
            additionalInfo: additionalInfo || {},
        };

        device.components.push(newComponent);
        await device.save();

        res.status(201).json({
            success: true,
            message: "Component added successfully.",
            components: device.components,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a Component in a Device
exports.updateComponent = async (req, res) => {
    const { serialNumber, componentId } = req.params;
    const { name, state, additionalInfo } = req.body;

    try {
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) return res.status(404).json({ message: "Device not found." });

        const component = device.components.id(componentId);
        if (!component) return res.status(404).json({ message: "Component not found." });

        if (name) component.name = name;
        if (state) component.state = state;
        if (additionalInfo) component.additionalInfo = additionalInfo;

        await device.save();

        res.status(200).json({
            success: true,
            message: "Component updated successfully.",
            component,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove a Component from a Device
exports.removeComponent = async (req, res) => {
    const { serialNumber, componentId } = req.params;

    try {
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) return res.status(404).json({ message: "Device not found." });

        device.components = device.components.filter(
            (component) => component._id.toString() !== componentId
        );

        await device.save();

        res.status(200).json({
            success: true,
            message: "Component removed successfully.",
            components: device.components,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch All Components of a Device
exports.getComponents = async (req, res) => {
    const { serialNumber } = req.params;

    try {
        const device = await Device.findOne({ serialNumber, userId: req.user.id });
        if (!device) return res.status(404).json({ message: "Device not found." });

        res.status(200).json({
            success: true,
            message: "Components fetched successfully.",
            components: device.components,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};