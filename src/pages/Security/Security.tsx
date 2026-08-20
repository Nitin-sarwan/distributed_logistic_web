import { Link } from 'react-router-dom'

import { Card } from '@/components/Card'
import { ROUTES } from '@/constants'
import { ChangePasswordForm, LogoutEverywhereCard } from '@/features/auth'

import '../Profile/Profile.css'
import '../Addresses/Addresses.css'

export function Security() {
  return (
    <div className="page container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.profile}>Profile</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Security</span>
      </nav>

      <h1 className="page__title">Security</h1>
      <p className="page__subtitle">Manage your password and active sessions.</p>

      <div className="security-layout">
        <Card title="Change password">
          <ChangePasswordForm />
        </Card>

        <LogoutEverywhereCard />
      </div>
    </div>
  )
}
