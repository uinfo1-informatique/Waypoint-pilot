import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../Login.jsx'

describe('Login', () => {
  it('affiche une erreur si les champs sont vides', async () => {
    const user = userEvent.setup()
    render(<Login onLogin={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/renseignez/i)
  })

  it("appelle onLogin avec l'email saisi", async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()
    render(<Login onLogin={onLogin} />)

    await user.type(screen.getByLabelText(/email professionnel/i), 'ada@waypoint.io')
    await user.type(screen.getByLabelText(/mot de passe/i), 'motdepasse123')
    await user.click(screen.getByRole('button', { name: /se connecter/i }))

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('ada@waypoint.io'))
  })

  it('n\'affiche pas le modal par défaut', () => {
    render(<Login onLogin={vi.fn()} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('affiche le modal en cas de clic sur "Mot de passe oublié?"', async () => {
    const user = userEvent.setup()
    render(<Login onLogin={vi.fn()} />)

    const forgotLink = screen.getByRole('button', { name: /mot de passe oublié/i })
    await user.click(forgotLink)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Réinitialiser votre mot de passe/i)).toBeInTheDocument()
  })

  describe('Boutons', () => {
    it('bouton "Se connecter" est présent et fonctionnel', async () => {
      const user = userEvent.setup()
      const onLogin = vi.fn()
      render(<Login onLogin={onLogin} />)

      const connectButton = screen.getByRole('button', { name: /se connecter/i })
      expect(connectButton).toBeInTheDocument()
      expect(connectButton).not.toBeDisabled()

      await user.type(screen.getByLabelText(/email professionnel/i), 'test@test.fr')
      await user.type(screen.getByLabelText(/mot de passe/i), 'pass123')
      await user.click(connectButton)

      await waitFor(() => expect(onLogin).toHaveBeenCalled())
    })

    it('bouton "Se connecter" devient désactivé pendant la soumission', async () => {
      const user = userEvent.setup()
      render(<Login onLogin={vi.fn()} />)

      const connectButton = screen.getByRole('button', { name: /se connecter/i })
      await user.type(screen.getByLabelText(/email professionnel/i), 'test@test.fr')
      await user.type(screen.getByLabelText(/mot de passe/i), 'pass123')

      await user.click(connectButton)

      expect(connectButton).toBeDisabled()
      expect(connectButton).toHaveTextContent(/connexion/i)

      await waitFor(() => expect(connectButton).not.toBeDisabled())
    })

    it('bouton "Mot de passe oublié?" est présent et fonctionnel', async () => {
      const user = userEvent.setup()
      render(<Login onLogin={vi.fn()} />)

      const forgotButton = screen.getByRole('button', { name: /mot de passe oublié/i })
      expect(forgotButton).toBeInTheDocument()
      expect(forgotButton).not.toBeDisabled()

      await user.click(forgotButton)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('Champs de saisie', () => {
    it('accepte l\'email et le mot de passe', async () => {
      const user = userEvent.setup()
      render(<Login onLogin={vi.fn()} />)

      const emailInput = screen.getByLabelText(/email professionnel/i)
      const passwordInput = screen.getByLabelText(/mot de passe/i)

      await user.type(emailInput, 'ada@waypoint.io')
      await user.type(passwordInput, 'secure123')

      expect(emailInput).toHaveValue('ada@waypoint.io')
      expect(passwordInput).toHaveValue('secure123')
    })

    it('efface le message d\'erreur lors de la résoumission', async () => {
      const user = userEvent.setup()
      render(<Login onLogin={vi.fn()} />)

      // Première soumission sans données
      await user.click(screen.getByRole('button', { name: /se connecter/i }))
      expect(screen.getByRole('alert')).toHaveTextContent(/renseignez/i)

      // Deuxième tentative avec données
      await user.type(screen.getByLabelText(/email professionnel/i), 'test@test.fr')
      await user.click(screen.getByRole('button', { name: /se connecter/i }))

      // L'erreur ne doit pas être visible après une soumission valide
      const emailInput = screen.getByLabelText(/email professionnel/i)
      expect(emailInput).toHaveValue('test@test.fr')
    })
  })
})
