import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/tokens.css'

/**
 * Point d'entrée de l'application
 * 
 * Initialise :
 * 1. Les styles globaux (tokens CSS pour les couleurs, typographie, etc.)
 * 2. Le composant racine App (gestion de l'authentification et du routage)
 * 3. React.StrictMode pour détecter les problèmes de rendu
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
