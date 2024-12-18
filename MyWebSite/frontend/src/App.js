import React from "react";
import "./assets/styles/App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import HomePage from "./components/HomePage";
import DashboardPage from "./components/Dashboard";
import CoursesPage from "./components/CoursesPage";
import ChatRoomPage from "./components/ChatRoom";
import JobPortalPage from "./components/JobPortal";
import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/NotFoundPage";
import Navbar from "./components/NavigationBar";
import Footer from "./components/Footer";

// Context
import { AuthProvider } from "./context/AuthContext";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>  
            <AuthProvider>
                <div className="App">
                    
                    <Navbar />

                    
                    <Routes>
                        
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/not-found" element={<NotFoundPage />} />

                        
                        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
                        <Route path="/jobs" element={<ProtectedRoute><JobPortalPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                        {/* Catch-all route */}
                        <Route path="*" element={<Navigate to="/not-found" />} />
                    </Routes>

                    {/* Footer */}
                    <Footer />
                </div>
            </AuthProvider>
        </Router>  
    );
}

export default App;