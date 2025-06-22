import React from "react";
export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "1rem" }}>
      © {new Date().getFullYear()} MyWebSite
    </footer>
  );
}