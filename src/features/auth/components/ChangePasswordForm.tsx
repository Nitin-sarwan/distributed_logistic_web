import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ApiError } from '@/services'

import { changePassword } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'
import {
  JOI_OPTIONS,
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../validation'

import './AuthForm.css'

/**
 * Change the password of a signed-in user.
 *
 * The current password is required as well as a live session — an unattended
 * signed-in browser must not be enough to take an account permanently. The
 * backend enforces this; the field here simply collects it.
 */
export function ChangePasswordForm() {
  const { clearSession } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: joiResolver(changePasswordSchema, JOI_OPTIONS),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      })

      // Clear the form so the passwords do not sit in the DOM afterwards.
      reset()
      setDone(true)

      // The backend revoked every session and rotated the token secret, so the
      // credential this tab holds is already dead. Reflecting that immediately
      // is more honest than leaving a signed-in shell that 401s on the next
      // click.
      clearSession()
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null

      if (apiError?.fieldErrors.current_password) {
        setError('current_password', { message: apiError.fieldErrors.current_password })
      }

      setFormError(apiError?.message ?? 'Could not change your password.')
    }
  })

  if (done) {
    return (
      <Alert tone="success">
        Password changed. For your security we signed you out of every device — please
        log in again with your new password.
      </Alert>
    )
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <Alert tone="info">
        Changing your password signs you out everywhere, including this device.
      </Alert>

      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        error={errors.current_password?.message}
        {...register('current_password')}
      />

      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
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
        isLoading={isSubmitting}
        loadingText="Changing password…"
      >
        Change password
      </Button>
    </form>
  )
}
