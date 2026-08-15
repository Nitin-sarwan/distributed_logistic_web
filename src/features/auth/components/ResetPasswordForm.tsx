import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ROUTES } from '@/constants'
import { ApiError } from '@/services'

import { resetPassword } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'
import { useAuthModal } from '../hooks/useAuthModal'
import {
  JOI_OPTIONS,
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../validation'

import './AuthForm.css'

export interface ResetPasswordFormProps {
  /** Token from the reset link's query string. */
  token: string
}

/**
 * Set a new password using a reset token.
 *
 * This lives on its own route rather than in the modal because it is reached
 * from an emailed link, not from a header button.
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const { clearSession } = useAuth()
  const { open } = useAuthModal()
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: joiResolver(resetPasswordSchema, JOI_OPTIONS),
    defaultValues: { token, new_password: '', confirm_password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await resetPassword({ token: values.token, new_password: values.new_password })
      setDone(true)
      // A reset revokes every session, on the assumption the old password may
      // have been compromised.
      clearSession()
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Could not reset your password. Please try again.',
      )
    }
  })

  if (done) {
    return (
      <div className="auth-form">
        <Alert tone="success">
          Your password has been reset and all existing sessions were signed out.
        </Alert>
        <Button
          size="lg"
          onClick={() => {
            navigate(ROUTES.home)
            open('login')
          }}
        >
          Log in
        </Button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      {/* The token travels in a hidden field so it is submitted with the form
          and validated alongside the passwords, rather than being read from the
          URL again at submit time. */}
      <input type="hidden" {...register('token')} />
      {errors.token?.message && <Alert tone="error">{errors.token.message}</Alert>}

      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        autoFocus
        hint="At least 8 characters, including a letter and a number."
        error={errors.new_password?.message}
        {...register('new_password')}
      />

      <Input
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirm_password?.message}
        {...register('confirm_password')}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Resetting password…"
      >
        Reset password
      </Button>
    </form>
  )
}
