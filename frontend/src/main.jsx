import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App.jsx'
import { startSyncManager } from './infrastructure/offline/syncManager.js'

// Arranca la detección de conectividad y el procesamiento de la cola offline.
startSyncManager()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
