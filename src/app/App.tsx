import { useLocation } from 'react-router-dom'

import { isPartnerRoute } from '@/constants'

import { CustomerLayout } from './layouts/CustomerLayout'
import { PartnerAppLayout } from './layouts/PartnerAppLayout'
import { AppRouter } from './router'

import './App.css'

export function App() {
  const location = useLocation()

  const Layout = isPartnerRoute(location.pathname) ? PartnerAppLayout : CustomerLayout

  return (
    <Layout>
      <AppRouter />
    </Layout>
  )
}
