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

// Service workers: avoid blocking third-party ad requests. Register only in production.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isProductionSecureHost = location.protocol === 'https:' && !['localhost', '127.0.0.1'].includes(location.hostname);

    if (!isProductionSecureHost) {
      return;
    }

    navigator.serviceWorker.register('/cache-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('Cache SW registered successfully:', registration);
        setInterval(() => {
          registration.update();
        }, 21600000);
      })
      .catch((err) => {
        console.log('Cache SW registration failed:', err);
      });
  });
}
