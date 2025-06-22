import React from "react";
export default function ProtectedRoute({ children }) {
  // Replace this with your real auth logic
  const isAuthenticated = true;
  return isAuthenticated ? children : <div>Please log in</div>;
}