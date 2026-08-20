import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ApiError } from '@/services'

import { useAuth } from '../hooks/useAuth'
import { JOI_OPTIONS, loginSchema, type LoginFormValues } from '../validation'

import './AuthForm.css'

export interface LoginFormProps {
  onSuccess: () => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
}

export function LoginForm({
  onSuccess,
  onSwitchToSignup,
  onForgotPassword,
}: LoginFormProps) {
  const { login } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: joiResolver(loginSchema, JOI_OPTIONS),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })

      onSuccess()
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null

      if (apiError?.fieldErrors && Object.keys(apiError.fieldErrors).length > 0) {
        for (const [field, message] of Object.entries(apiError.fieldErrors)) {
          if (field === 'email' || field === 'password') {
            setError(field, { message })
          }
        }
      }

      setFormError(apiError?.message ?? 'Could not log you in. Please try again.')
    }
  })

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <p className="auth-form__intro">
        Log in to book deliveries and manage your saved addresses.
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

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <button type="button" className="auth-form__link-btn" onClick={onForgotPassword}>
        Forgot password?
      </button>

      <Button
        type="submit"
        size="lg"
        fullWidth

        isLoading={isSubmitting}
        loadingText="Logging in…"
      >
        Log in
      </Button>

      <p className="auth-form__switch">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </form>
  )
}
