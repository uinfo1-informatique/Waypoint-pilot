import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForgotPassword from '../ForgotPassword'

describe('ForgotPassword', () => {
  let mockOnClose, mockOnSubmit

  beforeEach(() => {
    mockOnClose = vi.fn()
    mockOnSubmit = vi.fn()
  })

  it('renders nothing when show is false', () => {
    const { container } = render(
      <ForgotPassword
        show={false}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal when show is true', () => {
    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Réinitialiser votre mot de passe/i)).toBeInTheDocument()
  })

  it('accepts email input', async () => {
    const user = userEvent.setup()
    const mockSetEmail = vi.fn()

    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={mockSetEmail}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const emailInput = screen.getByLabelText(/email professionnel/i)
    await user.type(emailInput, 'test@example.com')

    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com')
  })

  it('shows error when submitting with empty email', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /Envoyer les instructions/i,
    })
    await user.click(submitButton)

    expect(screen.getByRole('alert')).toHaveTextContent(
      /Veuillez entrer votre adresse email/i
    )
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits with email and shows success message', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email="test@example.com"
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /Envoyer les instructions/i,
    })
    await user.click(submitButton)

    // Simulate 400ms API delay
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com')
    })

    expect(screen.getByText(/Email envoyé/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Vérifiez votre boîte de réception pour les instructions/i
      )
    ).toBeInTheDocument()
  })

  it('auto-closes after 2 seconds of success', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email="test@example.com"
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /Envoyer les instructions/i,
    })
    await user.click(submitButton)

    // Wait for submit to complete (400ms)
    await waitFor(() => {
      expect(screen.getByText(/Email envoyé/i)).toBeInTheDocument()
    })

    // Wait for auto-close (2000ms after success)
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('closes modal when close button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const closeButton = screen.getByRole('button', { name: /Fermer/i })
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes modal when pressing Escape key', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const modalOverlay = screen.getByRole('presentation')
    await user.keyboard('{Escape}')

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes modal when clicking backdrop', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email=""
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const backdrop = screen.getByRole('presentation')
    await user.click(backdrop)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('disables email input while submitting', async () => {
    const user = userEvent.setup()

    render(
      <ForgotPassword
        show={true}
        email="test@example.com"
        setEmail={() => {}}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /Envoyer les instructions/i,
    })
    const emailInput = screen.getByLabelText(/email professionnel/i)

    expect(emailInput).not.toBeDisabled()

    await user.click(submitButton)

    expect(emailInput).toBeDisabled()
  })
})
