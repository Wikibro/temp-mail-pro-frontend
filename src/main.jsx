import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/poppins/latin-400.css';
import '@fontsource/poppins/latin-400-italic.css';
import '@fontsource/poppins/latin-600.css';
import '@fontsource/poppins/latin-700.css';
import App from './App.jsx';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Workers Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    
    // 1. MONETAG SERVICE WORKER REGISTER
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Monetag SW registered successfully:', registration);
      })
      .catch((err) => {
        console.log('Monetag SW registration failed:', err);
      });

    // 2. PERFORMANCE CACHING WORKER REGISTER
    navigator.serviceWorker.register('/cache-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('Cache SW registered successfully:', registration);
        // Caching ko update karne ke liye interval check
        setInterval(() => {
          registration.update();
        }, 21600000);
      })
      .catch((err) => {
        console.log('Cache SW registration failed:', err);
      });

  });
}
