import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'
import { ApiError } from '@/services'

import { usePartner } from '../hooks/usePartner'
import {
  JOI_OPTIONS,
  partnerLoginSchema,
  type PartnerLoginFormValues,
} from '../validation'
import { PartnerAuthShell } from './PartnerAuthShell'

export function PartnerLogin() {
  const { login, isAuthenticated, isLoading } = usePartner()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PartnerLoginFormValues>({
    resolver: joiResolver(partnerLoginSchema, JOI_OPTIONS),
    defaultValues: { phone: '', password: '' },
  })

  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />
  }

  if (isAuthenticated) {
    return <Navigate to={from ?? ROUTES.partner} replace />
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await login({ phone: values.phone.trim(), password: values.password })

      navigate(from ?? ROUTES.partner, { replace: true })
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null

      if (apiError?.fieldErrors) {
        for (const [field, message] of Object.entries(apiError.fieldErrors)) {
          if (field === 'phone' || field === 'password') {
            setError(field, { message })
          }
        }
      }

      setFormError(apiError?.message ?? 'Could not sign you in. Please try again.')
    }
  })

  return (
    <PartnerAuthShell
      title="Partner sign in"
      subtitle="Manage your deliveries, vehicle, and availability."
    >
      <form className="partner-auth__form" onSubmit={onSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}

        <Input
          label="Phone number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          autoFocus
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          size="lg"
          fullWidth

          isLoading={isSubmitting}
          loadingText="Signing in…"
        >
          Sign in
        </Button>

        <p className="partner-auth__switch">
          New to LogisticPartner? <Link to={ROUTES.partnerSignup}>Become a partner</Link>
        </p>

      </form>
    </PartnerAuthShell>
  )
}
