import { useState, useEffect, useCallback } from 'react'

/**
 * Composant Modal - Réinitialisation de mot de passe
 * Affiche un formulaire overlé pour demander la réinitialisation du mot de passe
 * 
 * Fonctionnalités:
 * - Validation d'email
 * - Simulation d'appel API (400ms)
 * - Message de succès avec auto-fermeture (2s)
 * - Fermeture via bouton, Escape ou clic backdrop
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.show - Visibilité du modal
 * @param {string} props.email - Email actuel
 * @param {Function} props.setEmail - Mise à jour du champ email
 * @param {Function} props.onSubmit - Callback après soumission réussie
 * @param {Function} props.onClose - Callback pour fermer le modal
 * @returns {JSX.Element|null} Modal ou null si caché
 */
export default function ForgotPassword({
  show,
  email,
  setEmail,
  onSubmit,
  onClose,
}) {
  // États du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  /**
   * Réinitialise le modal à la fermeture
   */
  useEffect(() => {
    if (!show) {
      setIsSubmitting(false)
      setIsSuccess(false)
      setError('')
    }
  }, [show])

  /**
   * Auto-fermeture du modal 2 secondes après succès
   */
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose()
        setIsSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose])

  /**
   * Enregistre la touche Escape pour fermer le modal
   */
  useEffect(() => {
    if (show) {
      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }
      window.addEventListener('keydown', handleEscapeKey)
      return () => window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [show, onClose])

  /**
   * Valide et envoie la demande de réinitialisation
   * Simule un appel API avec délai de 400ms
   * @param {Event} event - Événement du formulaire
   */
  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    setError('')

    // Validation : email requis
    if (!email) {
      setError('Veuillez entrer votre adresse email.')
      return
    }

    // Simule une requête réseau
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      onSubmit(email)
    }, 400)
  }, [email, onSubmit])

  /**
   * Ferme le modal au clic sur le backdrop (zone transparente)
   * @param {Event} event - Événement du click
   */
  const handleBackdropClick = useCallback((event) => {
    // Ferme seulement si clic sur le backdrop lui-même, pas sur le contenu
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Le modal ne s'affiche que si show === true
  if (!show) return null

  return (
    <div
      className="login__modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="login__modal"
        role="dialog"
        aria-label="Réinitialiser votre mot de passe"
      >
        {/* Bouton de fermeture (×) */}
        <button
          className="login__modal-close"
          onClick={onClose}
          aria-label="Fermer"
          type="button"
        >
          ×
        </button>

        {/* Affichage conditionnel : succès ou formulaire */}
        {isSuccess ? (
          // Message de succès
          <div className="login__modal-success">
            <h2>Email envoyé</h2>
            <p>
              Vérifiez votre boîte de réception pour les instructions de réinitialisation.
            </p>
          </div>
        ) : (
          // Formulaire de réinitialisation
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <h2>Réinitialiser votre mot de passe</h2>
            <p className="login__subtitle">
              Entrez votre adresse email pour recevoir les instructions.
            </p>

            {/* Champ Email */}
            <label htmlFor="forgot-email">Email professionnel</label>
            <input
              id="forgot-email"
              name="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              placeholder="exemple@entreprise.fr"
            />

            {/* Affichage des erreurs si présentes */}
            {error && (
              <p role="alert" className="login__error">
                {error}
              </p>
            )}

            {/* Bouton de soumission */}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi…' : 'Envoyer les instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
