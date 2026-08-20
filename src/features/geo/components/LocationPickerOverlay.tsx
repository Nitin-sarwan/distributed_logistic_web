import { Button } from '@/components/Button'

export interface LocationPickerOverlayProps {
  isLocating: boolean
  onUseMyLocation: () => void
}

export function LocationPickerOverlay({
  isLocating,
  onUseMyLocation,
}: LocationPickerOverlayProps) {
  return (
    <>
      <span className="location-picker__pin" aria-hidden="true">
        <span className="map-pin" />
      </span>

      <Button
        variant="secondary"
        size="sm"
        className="location-picker__locate"
        onClick={onUseMyLocation}
        isLoading={isLocating}
        loadingText="Locating…"
      >
        Use my location
      </Button>
    </>
  )
}
