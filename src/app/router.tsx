import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { RequireAuth } from '@/features/auth'
import {
  PartnerDashboard,
  PartnerDeliveries,
  PartnerLayout,
  PartnerLogin,
  PartnerProfile,
  PartnerSignup,
  PartnerVehicle,
  RequirePartner,
} from '@/features/partner'
import { Addresses } from '@/pages/Addresses'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { Orders } from '@/pages/Orders'
import { Profile } from '@/pages/Profile'
import { ResetPassword } from '@/pages/ResetPassword'
import { Security } from '@/pages/Security'
import { TrackOrder } from '@/pages/TrackOrder'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.trackOrder} element={<TrackOrder />} />
      <Route path={ROUTES.resetPassword} element={<ResetPassword />} />

      <Route
        element={
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        }
      >
        <Route path={ROUTES.orders} element={<Orders />} />
        <Route path={ROUTES.profile} element={<Profile />} />
        <Route path={ROUTES.addresses} element={<Addresses />} />
        <Route path={ROUTES.security} element={<Security />} />
      </Route>
      <Route path={ROUTES.partnerLogin} element={<PartnerLogin />} />
      <Route path={ROUTES.partnerSignup} element={<PartnerSignup />} />
      <Route
        path={ROUTES.partner}
        element={
          <RequirePartner>
            <PartnerLayout />
          </RequirePartner>
        }
      >
        <Route index element={<PartnerDashboard />} />
        <Route path="deliveries" element={<PartnerDeliveries />} />
        <Route path="vehicle" element={<PartnerVehicle />} />
        <Route path="profile" element={<PartnerProfile />} />
      </Route>

      <Route path="/login" element={<Navigate to={ROUTES.home} replace />} />
      <Route path="/signup" element={<Navigate to={ROUTES.home} replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
