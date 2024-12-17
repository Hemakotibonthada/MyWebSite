// frontend/src/App.js

import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";

// Import Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import JobPortalPage from "./pages/JobPortalPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import Contexts and Utilities
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// App Component
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
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
                                    <DashboardPage />
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
                                    <ChatRoomPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/jobs"
                            element={
                                <ProtectedRoute>
                                    <JobPortalPage />
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
        </AuthProvider>
    );
}

export default App;