import { Navigate, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { RequireAuth } from '@/features/auth'
import { Addresses } from '@/pages/Addresses'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { Orders } from '@/pages/Orders'
import { Profile } from '@/pages/Profile'
import { ResetPassword } from '@/pages/ResetPassword'
import { Security } from '@/pages/Security'
import { TrackOrder } from '@/pages/TrackOrder'

/**
 * Route table.
 *
 * There is no `/login` or `/signup` route: authentication happens in a modal so
 * the user is never navigated away from what they were doing. `/reset-password`
 * is the exception, since it is reached from an emailed link.
 *
 * Adding a feature is adding routes here plus a folder under `features/` — the
 * order, payment, and dispatch screens will slot in without touching anything
 * that already exists.
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.home} element={<Home />} />
      {/* Public on purpose: tracking uses an order id, not an account. */}
      <Route path={ROUTES.trackOrder} element={<TrackOrder />} />
      <Route path={ROUTES.resetPassword} element={<ResetPassword />} />

      {/*
        Protected. RequireAuth decides what renders; it is not a security
        boundary — the backend re-authenticates every request behind these
        pages, so bypassing the guard yields a page whose data calls all 401.
      */}
      <Route
        path={ROUTES.orders}
        element={
          <RequireAuth>
            <Orders />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.profile}
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.addresses}
        element={
          <RequireAuth>
            <Addresses />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.security}
        element={
          <RequireAuth>
            <Security />
          </RequireAuth>
        }
      />

      {/* Legacy/alias paths, in case a link points at the pre-modal routes. */}
      <Route path="/login" element={<Navigate to={ROUTES.home} replace />} />
      <Route path="/signup" element={<Navigate to={ROUTES.home} replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
