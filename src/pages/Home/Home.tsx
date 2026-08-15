import { useAuth } from '@/features/auth'

import { BookingWidget } from './BookingWidget'

import './Home.css'

/** Selling points. Static copy — no service backs these yet. */
const HIGHLIGHTS = [
  {
    title: 'Two-wheeler to truck',
    description: 'Pick the vehicle that fits the load, from a parcel to a full house move.',
  },
  {
    title: 'Live tracking',
    description: 'Follow your driver from pickup to drop, and share the link with anyone.',
  },
  {
    title: 'Upfront pricing',
    description: 'See the fare before you book. No surprises when the delivery is done.',
  },
]

export function Home() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__copy">
            {/* Signed in, the page speaks to the task rather than the pitch —
                they have already been sold. */}
            {isAuthenticated && user ? (
              <>
                <h1 className="hero__title">Where are you moving today?</h1>
                <p className="hero__subtitle">
                  Welcome back, {user.name.split(' ')[0]}. Enter a pickup and drop
                  location to get started.
                </p>
              </>
            ) : (
              <>
                <h1 className="hero__title">
                  Move anything.
                  <br />
                  Anywhere.
                </h1>
                <p className="hero__subtitle">
                  Fast and reliable delivery at your doorstep. Book a vehicle in minutes
                  and track it the whole way.
                </p>
              </>
            )}
          </div>

          <div className="hero__widget">
            <div className="booking-card">
              <h2 className="booking-card__title">Book a delivery</h2>
              <BookingWidget />
            </div>
          </div>
        </div>
      </section>

      <section className="container highlights">
        {HIGHLIGHTS.map((highlight) => (
          <article key={highlight.title} className="highlight">
            <h3 className="highlight__title">{highlight.title}</h3>
            <p className="highlight__description">{highlight.description}</p>
          </article>
        ))}
      </section>

      <section className="container how">
        <h2 className="how__title">How it works</h2>
        <ol className="how__steps">
          <li className="how__step">
            <span className="how__number">1</span>
            <div>
              <h3 className="how__step-title">Enter pickup and drop</h3>
              <p className="how__step-text">Tell us where the delivery starts and ends.</p>
            </div>
          </li>
          <li className="how__step">
            <span className="how__number">2</span>
            <div>
              <h3 className="how__step-title">Choose a vehicle</h3>
              <p className="how__step-text">
                Pick what suits the load and see the fare upfront.
              </p>
            </div>
          </li>
          <li className="how__step">
            <span className="how__number">3</span>
            <div>
              <h3 className="how__step-title">Track to the door</h3>
              <p className="how__step-text">
                Follow your partner live until the delivery is complete.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  )
}
