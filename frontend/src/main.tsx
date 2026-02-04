import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// TEMPORARILY DISABLED: Service Worker causing infinite reload on Render
// Will re-enable after fixing cache issues
// if ('serviceWorker' in navigator && import.meta.env.PROD) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js', { scope: '/' })
//       .then(registration => {
//         console.log('SW registered:', registration)
//       })
//       .catch(error => {
//         console.log('SW registration failed:', error)
//       })
//   })
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
