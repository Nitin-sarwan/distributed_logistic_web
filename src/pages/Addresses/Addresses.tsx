import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { SavedAddresses } from '@/features/profile'

import './Addresses.css'

export function Addresses() {
  return (
    <div className="page container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.profile}>Profile</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Saved addresses</span>
      </nav>

      <h1 className="page__title">Saved addresses</h1>
      <p className="page__subtitle">
        Add the places you deliver from and to most often.
      </p>

      <div className="addresses-layout">
        <SavedAddresses />
      </div>
    </div>
  )
}
