import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Garantir que chaque actualisation (F5 / Rafraîchir) revienne toujours à l'état initial
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
if (window.location.hash) {
  try {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  } catch {
    // ignore
  }
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
