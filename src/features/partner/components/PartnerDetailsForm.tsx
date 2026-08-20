import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { useApiFormErrors } from '@/hooks'
import { formatPhone } from '@/utils'

import { usePartner } from '../hooks/usePartner'
import type { Partner } from '../types'

interface ProfileFormValues {
  name: string
  email: string
}

const FIELDS = ['name', 'email'] as const

export function PartnerDetailsForm({ partner }: { partner: Partner }) {
  const { updateProfile } = usePartner()
  const [saved, setSaved] = useState(false)
  const { formError, clearError, handleError } = useApiFormErrors<ProfileFormValues>()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: { name: partner.name, email: partner.email ?? '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearError()
    setSaved(false)

    const email = values.email.trim().toLowerCase()

    try {
      await updateProfile({
        name: values.name.trim(),
        email: email || null,
      })
      setSaved(true)
    } catch (caught) {
      handleError(caught, setError, [...FIELDS], 'Could not save your details. Try again.')
    }
  })

  return (
    <Card
      title="Your details"
      description="Your name is shown to customers on their delivery."
    >
      <form className="vehicle-form" onSubmit={onSubmit} noValidate>
        {formError && <Alert tone="error">{formError}</Alert>}
        {saved && <Alert tone="success">Your details have been saved.</Alert>}

        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Enter your full name.',
            maxLength: { value: 100, message: 'Name must be 100 characters or fewer.' },
          })}
        />

        <Input
          label="Email (optional)"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          hint="Leave blank if you would rather not give one."
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone number"
          value={formatPhone(partner.phone)}
          readOnly
          disabled
          hint="This is your sign-in number and cannot be changed here. Contact support to update it."
        />

        <div className="vehicle-form__actions">
          <Button
            type="submit"
            disabled={!isDirty}
            isLoading={isSubmitting}
            loadingText="Saving…"
          >
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  )
}
