import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Intercept and suppress noisy/malformed logs from third-party browser extensions (like MetaMask)
const suppressExtensionLogs = (originalConsole) => {
  return function (...args) {
    const logStr = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch (e) {
        return String(arg);
      }
    }).join(' ');

    // Match keywords from MetaMask/extension liveness and ObjectMultiplex errors
    if (
      logStr.includes('ObjectMultiplex') || 
      logStr.includes('app-init-liveness') || 
      logStr.includes('background-liveness') || 
      logStr.includes('MaxListenersExceededWarning') ||
      logStr.includes('Could not establish connection. Receiving end does not exist')
    ) {
      return; // Suppress
    }
    originalConsole.apply(console, args);
  };
};

console.warn = suppressExtensionLogs(console.warn);
console.error = suppressExtensionLogs(console.error);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
