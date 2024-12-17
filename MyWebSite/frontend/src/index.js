// frontend/src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css"; // Import global CSS

// Import Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Root Render
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);