import "./assets/styles/global.css"; // If you have global styles
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);