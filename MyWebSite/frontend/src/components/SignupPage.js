// frontend/src/components/SignupPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/SignupPage.css";
import axios from "axios";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        hasDevice: false,
        serialNumber: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const { firstName, lastName, email, password, confirmPassword, hasDevice, serialNumber } = formData;

        // Validate all required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (hasDevice && !serialNumber) {
            setError("Please provide a serial number for your IoT device");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5001/api/auth/register", formData);

            if (response.status === 201) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Create an Account</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="hasDevice"
                                checked={formData.hasDevice}
                                onChange={handleChange}
                            />
                            I have an IoT device
                        </label>
                    </div>
                    {formData.hasDevice && (
                        <div className="form-group">
                            <label>Device Serial Number</label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                placeholder="Enter device serial number"
                                required={formData.hasDevice}
                            />
                        </div>
                    )}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;