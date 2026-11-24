import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'

export function AppFooter() {
  return (
    <footer className="app__footer">
      <div className="container app__footer-inner">
        <span>LogisticPartner</span>
        <span>On-demand logistics, from A to B.</span>
        <nav className="app__footer-links" aria-label="Partners">
          <Link to={ROUTES.partnerSignup}>Become a partner</Link>
          <Link to={ROUTES.partnerLogin}>Partner login</Link>
        </nav>
      </div>
    </footer>
  )
}
