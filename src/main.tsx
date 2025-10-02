// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the usage of `react-dom/client` for React 18+
import App from './App'; // Import the main App component
import './app/globals.css'; // Import your global styles, ensure this file exists

// Create a root element to render your application
const rootElement = document.getElementById('root');

// Ensure that the root element exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
