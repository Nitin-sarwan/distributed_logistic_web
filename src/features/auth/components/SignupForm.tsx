import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ApiError } from '@/services'

import { useAuth } from '../hooks/useAuth'
import { JOI_OPTIONS, signupSchema, type SignupFormValues } from '../validation'

import './AuthForm.css'

export interface SignupFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

/** Fields the backend can attribute an error to, for 409/422 mapping. */
const MAPPABLE_FIELDS = new Set(['name', 'email', 'phone', 'password'])

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signup } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: joiResolver(signupSchema, JOI_OPTIONS),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await signup({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        // Omit rather than send "": the backend's validator requires exactly
        // 10 digits when the field is present.
        phone: values.phone.trim(),
        password: values.password,
      })

      // Registration issues a session, so the user is already logged in. No
      // "account created, now please sign in" step.
      onSuccess()
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null

      // 409 duplicates arrive with a field attached — mark the input rather
      // than making the user guess which one clashed.
      if (apiError?.fieldErrors) {
        for (const [field, message] of Object.entries(apiError.fieldErrors)) {
          if (MAPPABLE_FIELDS.has(field)) {
            setError(field as keyof SignupFormValues, { message })
          }
        }
      }

      setFormError(apiError?.message ?? 'Could not create your account. Please try again.')
    }
  })

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <p className="auth-form__intro">
        Create an account to book deliveries and save your frequent addresses.
      </p>

      {formError && <Alert tone="error">{formError}</Alert>}

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="Your name"
        autoFocus
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="10-digit number"
        prefix="+91"
        maxLength={10}
        hint="Your delivery partner uses this to reach you."
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        hint="At least 8 characters, including a letter and a number."
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Creating account…"
      >
        Sign up
      </Button>

      <p className="auth-form__switch">
        Already registered?{' '}
        <button type="button" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  )
}
