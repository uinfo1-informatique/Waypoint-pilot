import { useState, useCallback } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

/**
 * Application principale - Composant racine
 * Gère le routage entre les pages Login et Dashboard selon l'état d'authentification
 * 
 * État:
 * - null: L'utilisateur n'est pas authentifié → affiche Login
 * - objet: L'utilisateur est authentifié → affiche Dashboard
 * 
 * @component
 * @returns {JSX.Element} La page appropriée selon l'état d'authentification
 */
export default function App() {
  // État d'authentification : null = non authentifié, { email, ... } = authentifié
  const [user, setUser] = useState(null)

  /**
   * Gère la connexion : stocke l'email de l'utilisateur
   * @param {string} email - Email de l'utilisateur authentifié
   */
  const handleLogin = useCallback((email) => {
    setUser({ email })
  }, [])

  /**
   * Gère la déconnexion : réinitialise l'état utilisateur
   */
  const handleLogout = useCallback(() => {
    setUser(null)
  }, [])

  // Affiche le formulaire de connexion si pas authentifié
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Affiche le tableau de bord si authentifié
  return <Dashboard user={user} onLogout={handleLogout} />
}
