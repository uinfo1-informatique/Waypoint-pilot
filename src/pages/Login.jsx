import { useState } from 'react'
import ForgotPassword from './ForgotPassword'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Renseignez votre email et votre mot de passe.')
      return
    }

    setIsSubmitting(true)
    // Simule un appel réseau — à remplacer par un vrai appel API.
    setTimeout(() => {
      setIsSubmitting(false)
      onLogin(email)
    }, 400)
  }

  return (
    <div className="login">
      <aside className="login__brand">
        <span className="login__mark">Waypoint</span>
        <p className="login__tagline">
          Le point de suivi de vos projets d'équipe, sans le bruit.
        </p>
      </aside>

      <main className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h1>Se connecter</h1>
          <p className="login__subtitle">Accédez à votre espace Waypoint.</p>

          <label htmlFor="email">Email professionnel</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="button"
            className="login__forgot-link"
            onClick={() => setShowForgotModal(true)}
          >
            Mot de passe oublié ?
          </button>

          {error && (
            <p role="alert" className="login__error">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </main>

      <ForgotPassword
        show={showForgotModal}
        email={forgotEmail}
        setEmail={setForgotEmail}
        onSubmit={() => setForgotEmail('')}
        onClose={() => {
          setShowForgotModal(false)
          setForgotEmail('')
        }}
      />
    </div>
  )
}
