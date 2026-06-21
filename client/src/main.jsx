import { StrictMode } from 'react'
import ReactDOM,{ createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import "@fontsource/jetbrains-mono";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>

    <App />
    </AuthProvider>
  </StrictMode>,
)
