// frontend/src/utils/localStorage.js

// Utility functions for localStorage management

// Save data to localStorage
export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

// Load data from localStorage
export const loadFromLocalStorage = (key) => {
    try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) return null;
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
    }
};

// Remove data from localStorage
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
};

// Clear all data in localStorage
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
};

// Manage user token
export const saveAuthToken = (token) => {
    saveToLocalStorage("token", token);
};

export const getAuthToken = () => {
    return loadFromLocalStorage("token");
};

export const removeAuthToken = () => {
    removeFromLocalStorage("token");
};

// Manage user profile
export const saveUserProfile = (profile) => {
    saveToLocalStorage("user_profile", profile);
};

export const getUserProfile = () => {
    return loadFromLocalStorage("user_profile");
};

export const removeUserProfile = () => {
    removeFromLocalStorage("user_profile");
};