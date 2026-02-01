import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Yangi versiya mavjud. Yangilashni xohlaysizmi?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Ilova offline rejimda ishlashga tayyor')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
