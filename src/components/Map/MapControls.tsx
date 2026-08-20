import { cx } from '@/utils'

import { FullscreenIcon, StyleIcon } from './MapIcons'
import { useMapStyle } from './MapStyleContext'
import { MAP_STYLES, MAP_STYLE_ORDER } from './tileStyles'

export interface MapControlsProps {
  allowFullscreen: boolean
  showStyleSwitcher: boolean
  isExpanded: boolean
  onToggleFullscreen: () => void
}

export function MapControls({
  allowFullscreen,
  showStyleSwitcher,
  isExpanded,
  onToggleFullscreen,
}: MapControlsProps) {
  const { style, setStyle, canChangeStyle } = useMapStyle()
  const withSwitcher = showStyleSwitcher && canChangeStyle

  if (!allowFullscreen && !withSwitcher) return null

  return (
    <div className="map-controls">
      {allowFullscreen && (
        <button
          type="button"
          className="map-control-btn"
          onClick={onToggleFullscreen}
          title={isExpanded ? 'Exit fullscreen' : 'View fullscreen'}
          aria-label={isExpanded ? 'Exit fullscreen' : 'View fullscreen'}
          aria-pressed={isExpanded}
        >
          <FullscreenIcon isExpanded={isExpanded} />
        </button>
      )}

      {withSwitcher && (
        <div
          className="map-styles"
          role="group"
          aria-label="Map style"

          onMouseDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          {MAP_STYLE_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={cx(
                'map-control-btn',
                'map-styles__btn',
                style === id && 'map-styles__btn--active',
              )}
              onClick={() => setStyle(id)}
              title={`${MAP_STYLES[id].label} map`}
              aria-label={`${MAP_STYLES[id].label} map`}
              aria-pressed={style === id}
            >
              <StyleIcon id={id} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
