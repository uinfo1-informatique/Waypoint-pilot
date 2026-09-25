import { useState, useEffect } from 'react'

export default function ForgotPassword({
  show,
  email,
  setEmail,
  onSubmit,
  onClose,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!show) {
      setIsSubmitting(false)
      setIsSuccess(false)
      setError('')
    }
  }, [show])

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose()
        setIsSuccess(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose])

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

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email) {
      setError('Veuillez entrer votre adresse email.')
      return
    }

    setIsSubmitting(true)
    // Simule un appel réseau — à remplacer par un vrai appel API.
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      onSubmit(email)
    }, 400)
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!show) return null

  return (
    <div
      className="login__modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className="login__modal" role="dialog" aria-label="Réinitialiser votre mot de passe">
        <button
          className="login__modal-close"
          onClick={onClose}
          aria-label="Fermer"
          type="button"
        >
          ×
        </button>

        {isSuccess ? (
          <div className="login__modal-success">
            <h2>Email envoyé</h2>
            <p>
              Vérifiez votre boîte de réception pour les instructions de réinitialisation.
            </p>
          </div>
        ) : (
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <h2>Réinitialiser votre mot de passe</h2>
            <p className="login__subtitle">
              Entrez votre adresse email pour recevoir les instructions.
            </p>

            <label htmlFor="forgot-email">Email professionnel</label>
            <input
              id="forgot-email"
              name="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />

            {error && (
              <p role="alert" className="login__error">
                {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi…' : 'Envoyer les instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
