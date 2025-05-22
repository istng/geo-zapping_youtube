import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { router } from './routes.tsx'
import '@mantine/core/styles.css'
import './index.css'

// Load and initialize router
await router.load()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
