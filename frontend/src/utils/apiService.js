// frontend/src/utils/apiService.js

import axios from "axios";

// Base API Configuration
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach Authorization Token (if present)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== DEVICE SERVICES ====================
export const fetchDeviceData = async () => {
    return await API.get("/devices");
};

export const fetchDeviceStatus = async (deviceId) => {
    return await API.get(`/devices/status/${deviceId}`);
};

export const controlDevice = async (deviceId, action) => {
    return await API.post(`/devices/control/${deviceId}`, { action });
};

export const addDevice = async (deviceData) => {
    return await API.post("/devices", deviceData);
};

// ==================== COURSE SERVICES ====================
export const fetchCourses = async () => {
    return await API.get("/courses");
};

export const fetchCourseDetails = async (courseId) => {
    return await API.get(`/courses/${courseId}`);
};

export const enrollInCourse = async (courseId) => {
    return await API.post(`/courses/enroll/${courseId}`);
};

// ==================== CHAT SERVICES ====================
export const fetchChatRooms = async () => {
    return await API.get("/chat/rooms");
};

export const sendMessage = async (roomId, message) => {
    return await API.post(`/chat/rooms/${roomId}/message`, { message });
};

export const fetchMessages = async (roomId) => {
    return await API.get(`/chat/rooms/${roomId}/messages`);
};

// ==================== JOB PORTAL SERVICES ====================
export const fetchJobs = async () => {
    return await API.get("/jobs");
};

export const fetchJobDetails = async (jobId) => {
    return await API.get(`/jobs/${jobId}`);
};

export const applyForJob = async (jobId, applicantData) => {
    return await API.post(`/jobs/apply/${jobId}`, applicantData);
};

export const postJob = async (jobData) => {
    return await API.post("/jobs", jobData);
};

// ==================== SOCIAL MEDIA SERVICES ====================
export const fetchSocialAccounts = async () => {
    return await API.get("/social/accounts");
};

export const fetchSocialFeeds = async (platform) => {
    return await API.get(`/social/feeds/${platform}`);
};

// ==================== AUTH SERVICES ====================
export const loginUser = async (credentials) => {
    return await API.post("/auth/login", credentials);
};

export const signupUser = async (userData) => {
    return await API.post("/auth/signup", userData);
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};

// ==================== ERROR HANDLING WRAPPER ====================
export const safeRequest = async (apiFunction, ...params) => {
    try {
        const response = await apiFunction(...params);
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data?.message || error.message);
        throw error;
    }
};