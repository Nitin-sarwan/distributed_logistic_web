import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Link, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ROUTES } from '@/constants'
import { useApiFormErrors } from '@/hooks'

import { usePartner } from '../hooks/usePartner'
import {
  JOI_OPTIONS,
  partnerSignupSchema,
  type PartnerSignupFormValues,
} from '../validation'

const FIELDS = ['name', 'phone', 'email', 'password'] as const

export function PartnerSignupForm() {
  const { signup } = usePartner()
  const navigate = useNavigate()
  const { formError, clearError, handleError } = useApiFormErrors<PartnerSignupFormValues>()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PartnerSignupFormValues>({
    resolver: joiResolver(partnerSignupSchema, JOI_OPTIONS),
    defaultValues: { name: '', phone: '', email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearError()
    const email = values.email.trim().toLowerCase()

    try {
      await signup({
        name: values.name.trim(),
        phone: values.phone.trim(),
        password: values.password,
        ...(email ? { email } : {}),
      })

      navigate(ROUTES.partner, { replace: true })
    } catch (caught) {
      handleError(caught, setError, [...FIELDS], 'Could not create your account. Try again.')
    }
  })

  return (
    <form className="partner-auth__form" onSubmit={onSubmit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="As printed on your licence"
        autoFocus
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Phone number"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="10-digit mobile number"
        hint="This is how you will sign in, and how customers reach you."
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Email (optional)"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        hint="Use 8 or more characters, with at least one letter and one number."
        error={errors.password?.message}
        {...register('password')}
      />

      <Alert tone="info">
        After signing up, our team verifies your documents before you can go online.
        You can add your vehicle straight away.
      </Alert>

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Creating your account…"
      >
        Create partner account
      </Button>

      <p className="partner-auth__switch">
        Already a partner? <Link to={ROUTES.partnerLogin}>Sign in</Link>
      </p>
    </form>
  )
}
