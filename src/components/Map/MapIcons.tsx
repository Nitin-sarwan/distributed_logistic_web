import type { MapStyle } from './types'

export function FullscreenIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <Svg>
      <path
        d={isExpanded ? 'M8 3v5H3M12 17v-5h5' : 'M3 8V3h5M17 12v5h-5'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={isExpanded ? 'M3 17h5v-5M17 3h-5v5' : 'M17 8V3h-5M3 12v5h5'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function StyleIcon({ id }: { id: MapStyle }) {
  if (id === 'street') {
    return (
      <Svg>
        <path
          d="M2.5 5.5 7.5 3.5v11l-5 2v-11ZM7.5 3.5l5 2v11l-5-2M12.5 5.5l5-2v11l-5 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

  if (id === 'light') {
    return (
      <Svg>
        <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 2v2m0 12v2M2 10h2m12 0h2M4.6 4.6 6 6m8 8 1.4 1.4m0-10.8L14 6m-8 8-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    )
  }

  return (
    <Svg>
      <path
        d="M16 11.8A6.5 6.5 0 0 1 8.2 4a6.5 6.5 0 1 0 7.8 7.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}
