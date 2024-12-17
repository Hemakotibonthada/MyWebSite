import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Adjust as needed
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);