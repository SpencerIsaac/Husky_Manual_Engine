import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// This is the frontend entry point.
// It finds the `<div id="root">` in `index.html` and mounts the React app into it.
createRoot(document.getElementById('root')!).render(
  // StrictMode adds extra development checks and warnings.
  // It helps catch unsafe patterns early while building the app.
  <StrictMode>
    <App />
  </StrictMode>,
)
