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
})
