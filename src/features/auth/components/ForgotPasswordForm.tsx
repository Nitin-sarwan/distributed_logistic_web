import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ROUTES } from '@/constants'
import { ApiError } from '@/services'

import { forgotPassword } from '../api'
import {
  JOI_OPTIONS,
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../validation'

import './AuthForm.css'

export interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const [devResetToken, setDevResetToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: joiResolver(forgotPasswordSchema, JOI_OPTIONS),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      const { resetToken } = await forgotPassword(values.email.trim().toLowerCase())
      setSent(true)

      if (resetToken) setDevResetToken(resetToken)
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Could not send the reset link. Please try again.',
      )
    }
  })

  if (sent) {
    return (
      <div className="auth-form">

        <Alert tone="success">
          If that email is registered, we&apos;ve sent a reset link to it. Check your
          inbox.
        </Alert>

        {devResetToken && (
          <Alert tone="warning">
            <strong>Development only.</strong> Mail delivery is not configured, so the
            backend returned the token directly.{' '}
            <a href={`${ROUTES.resetPassword}?token=${encodeURIComponent(devResetToken)}`}>
              Open the reset link
            </a>
          </Alert>
        )}

        <Button variant="secondary" size="lg" fullWidth onClick={onBackToLogin}>
          Back to login
        </Button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <p className="auth-form__intro">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      {formError && <Alert tone="error">{formError}</Alert>}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        autoFocus
        error={errors.email?.message}
        {...register('email')}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Sending link…"
      >
        Send reset link
      </Button>

      <p className="auth-form__switch">
        Remembered it?{' '}
        <button type="button" onClick={onBackToLogin}>
          Log in
        </button>
      </p>
    </form>
  )
}
