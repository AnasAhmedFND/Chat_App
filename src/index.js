// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // তোমার নিজের CSS ফাইল
import App from './App'; // App component
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // PWA এর জন্য

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA কে enable করতে service worker register করো
serviceWorkerRegistration.register();