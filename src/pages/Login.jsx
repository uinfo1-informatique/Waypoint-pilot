import { useState, useCallback } from 'react'
import ForgotPassword from './ForgotPassword'
import './Login.css'

/**
 * Page de connexion
 * Fournit un formulaire d'authentification avec :
 * - Saisie email et mot de passe
 * - Validation des champs
 * - Lien d'accès au formulaire "Mot de passe oublié"
 * - Simulation de délai réseau (400ms)
 * 
 * @component
 * @param {Object} props
 * @param {Function} props.onLogin - Callback appelée après authentification réussie
 * @returns {JSX.Element} Formulaire de connexion avec modal mot de passe oublié
 */
export default function Login({ onLogin }) {
  // État du formulaire de connexion
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // État du modal "Mot de passe oublié?"
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  /**
   * Valide et envoie le formulaire de connexion
   * Simule un appel API avec délai de 400ms
   * @param {Event} event - Événement du formulaire
   */
  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    setError('')

    // Validation : email et mot de passe requis
    if (!email || !password) {
      setError('Renseignez votre email et votre mot de passe.')
      return
    }

    // Simule une requête réseau
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onLogin(email)
    }, 400)
  }, [email, password, onLogin])

  /**
   * Ouvre le modal de réinitialisation de mot de passe
   */
  const handleOpenForgotModal = useCallback(() => {
    setShowForgotModal(true)
  }, [])

  /**
   * Ferme le modal et réinitialise ses données
   */
  const handleCloseForgotModal = useCallback(() => {
    setShowForgotModal(false)
    setForgotEmail('')
  }, [])

  return (
    <div className="login">
      {/* Sidebar de branding */}
      <aside className="login__brand">
        <span className="login__mark">Waypoint</span>
        <p className="login__tagline">
          Le point de suivi de vos projets d'équipe, sans le bruit.
        </p>
      </aside>

      {/* Panneau avec formulaire de connexion */}
      <main className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h1>Se connecter</h1>
          <p className="login__subtitle">Accédez à votre espace Waypoint.</p>

          {/* Champ Email */}
          <label htmlFor="email">Email professionnel</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            placeholder="exemple@entreprise.fr"
          />

          {/* Champ Mot de passe */}
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            placeholder="••••••••"
          />

          {/* Lien accès au modal mot de passe oublié */}
          <button
            type="button"
            className="login__forgot-link"
            onClick={handleOpenForgotModal}
            disabled={isSubmitting}
          >
            Mot de passe oublié ?
          </button>

          {/* Affichage des erreurs si présentes */}
          {error && (
            <p role="alert" className="login__error">
              {error}
            </p>
          )}

          {/* Bouton de soumission */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </main>

      {/* Modal Mot de passe oublié */}
      <ForgotPassword
        show={showForgotModal}
        email={forgotEmail}
        setEmail={setForgotEmail}
        onSubmit={() => setForgotEmail('')}
        onClose={handleCloseForgotModal}
      />
    </div>
  )
}
