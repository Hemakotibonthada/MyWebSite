// frontend/src/App.js

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Import Components (update paths to match your structure)
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import CoursesPage from "./components/CoursesPage";
import ChatRoom from "./components/ChatRoom";
import JobPortal from "./components/JobPortal";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/NotFoundPage";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// If you have AuthProvider, import it; otherwise, remove it and use plain JSX
// import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        // <AuthProvider> {/* Uncomment if you have AuthProvider */}
            <Router>
                <div className="App">
                    <NavigationBar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/not-found" element={<NotFoundPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/courses"
                            element={
                                <ProtectedRoute>
                                    <CoursesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/chat"
                            element={
                                <ProtectedRoute>
                                    <ChatRoom />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/jobs"
                            element={
                                <ProtectedRoute>
                                    <JobPortal />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect to 404 for undefined routes */}
                        <Route path="*" element={<Navigate to="/not-found" />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        // </AuthProvider> {/* Uncomment if you have AuthProvider */}
    );
}

export default App;