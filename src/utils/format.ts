/** Presentation helpers. No business rules, no API knowledge. */

/** "12 March 2024" from an ISO timestamp. Falsy or unparseable input yields "—". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * "+91 98765 43210" from a bare 10-digit number; anything else passes through.
 *
 * Still tolerates null despite `User.phone` being non-null, since this is a
 * generic helper and rows created before the column was enforced may lack one.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
}

/** "NS" from "Nitish Sarwan" — for the header avatar. */
export function initials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'

  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''

  return (first + last).toUpperCase()
}

/** Join class names, dropping falsy entries. Avoids a dependency for one line. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
