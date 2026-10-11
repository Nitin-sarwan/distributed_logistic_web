// Line drawings of each vehicle class, for the driver's marker on the map.
// Inner SVG for a 24x24 viewBox; the map supplies stroke and colour.

const TWO_WHEELER = [
  '<circle cx="5.5" cy="16.5" r="2.5"/>',
  '<circle cx="18.5" cy="16.5" r="2.5"/>',
  // footboard to the front fork
  '<path d="M8 16.5h6l3-6"/>',
  // handlebar
  '<path d="M15 6.5h3l-1 4"/>',
  // seat and rear body
  '<path d="M3.5 12.5h7l1.5 4"/>',
].join('')

// An auto-rickshaw: domed canopy, open side, one small wheel at the front.
const THREE_WHEELER = [
  '<circle cx="6.5" cy="17.5" r="2"/>',
  '<circle cx="18.5" cy="17.5" r="1.5"/>',
  // domed canopy sweeping down to the nose
  '<path d="M3.5 15.5V10a5 5 0 0 1 5-5h4.5a3 3 0 0 1 2.9 2.2L18.5 14l2 1.5"/>',
  // open doorway
  '<path d="M10.5 15.5V9.5h4.5"/>',
  // floor between the wheels
  '<path d="M8.5 15.5h8.5"/>',
].join('')

const MINI_TRUCK = [
  // cargo box
  '<path d="M2.5 6.5h10v9h-10z"/>',
  // cab
  '<path d="M12.5 9.5h4l3 3v3h-7"/>',
  '<circle cx="6.5" cy="17.5" r="1.8"/>',
  '<circle cx="16.5" cy="17.5" r="1.8"/>',
].join('')

const TRUCK = [
  // long cargo box
  '<path d="M1.5 5h13.5v10.5H1.5z"/>',
  // cab
  '<path d="M15 8.5h3.5l3.5 3.5v3.5h-7"/>',
  // three axles
  '<circle cx="4.5" cy="17.5" r="1.6"/>',
  '<circle cx="9" cy="17.5" r="1.6"/>',
  '<circle cx="18.5" cy="17.5" r="1.6"/>',
].join('')

const SYMBOLS: Record<string, string> = {
  two_wheeler: TWO_WHEELER,
  three_wheeler: THREE_WHEELER,
  mini_truck: MINI_TRUCK,
  truck: TRUCK,
}

/** The drawing for this vehicle type; a mini truck for anything unknown. */
export function vehicleSymbol(vehicleType: string): string {
  return SYMBOLS[vehicleType] ?? MINI_TRUCK
}
