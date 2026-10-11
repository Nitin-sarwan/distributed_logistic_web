import { Alert } from '@/components/Alert'
import { Card } from '@/components/Card'
import { Loader } from '@/components/Loader'

import { useNotificationPreferences } from '../hooks/useNotificationPreferences'
import type { NotificationAudience } from '../types'
import { categoryLabel } from '../utils'

import './Notifications.css'

interface ToggleProps {
  label: string
  hint?: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, hint, checked, disabled, onChange }: ToggleProps) {
  return (
    <label className="pref">
      <span className="pref__text">
        <span className="pref__label">{label}</span>
        {hint && <span className="pref__hint">{hint}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="pref__switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  )
}

export function NotificationPreferencesCard({ audience }: { audience: NotificationAudience }) {
  const { preferences, isLoading, isSaving, error, setChannel, setCategoryMuted } =
    useNotificationPreferences(audience)

  return (
    <Card
      title="Notification settings"
      description="Everything always appears in this feed. These decide what else reaches you."
    >
      {isLoading && <Loader label="Loading settings…" />}
      {error && <Alert tone="error">{error}</Alert>}

      {preferences && (
        <div className="pref-groups">
          <div className="pref-group">
            <p className="pref-group__title">Channels</p>
            <Toggle
              label="Email"
              checked={preferences.email_enabled}
              disabled={isSaving}
              onChange={(on) => void setChannel('email_enabled', on)}
            />
            <Toggle
              label="Push"
              checked={preferences.push_enabled}
              disabled={isSaving}
              onChange={(on) => void setChannel('push_enabled', on)}
            />
          </div>

          <div className="pref-group">
            <p className="pref-group__title">Topics</p>
            {preferences.mutable_categories.map((category) => (
              <Toggle
                key={category}
                label={categoryLabel(category)}
                checked={!preferences.muted_categories.includes(category)}
                disabled={isSaving}
                onChange={(on) => void setCategoryMuted(category, !on)}
              />
            ))}
            {audience === 'partner' && (
              <p className="pref__hint">
                Job offers cannot be turned off — muting them would leave you online but
                unreachable. Go offline instead.
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
