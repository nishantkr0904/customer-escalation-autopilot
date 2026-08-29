/**
 * Formats an ISO date string to human-readable format.
 * Example: "2026-08-29T10:15:00Z" -> "Aug 29, 2026 10:15 AM"
 */
export function formatDate(isoDate?: string | null): string {
  if (!isoDate) return 'N/A'
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  } catch {
    return 'N/A'
  }
}

/**
 * Formats an ISO date string relative to now.
 * Example: "2 hours ago", "3 days ago", "Just now"
 */
export function formatRelativeTime(isoDate?: string | null): string {
  if (!isoDate) return 'N/A'
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return 'N/A'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 30) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 30) return `${diffDays}d ago`
    return formatDate(isoDate)
  } catch {
    return 'N/A'
  }
}

/**
 * Formats a currency number into USD.
 * Example: 285000 -> "$285,000"
 */
export function formatCurrency(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats duration in milliseconds into a readable string.
 * Example: 1230 -> "1.2s", 450 -> "450ms"
 */
export function formatDuration(durationMs?: number | null): string {
  if (durationMs === undefined || durationMs === null || isNaN(durationMs)) return '0ms'
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(1)}s`
  }
  return `${Math.round(durationMs)}ms`
}

/**
 * Capitalizes and formats severity string.
 * Example: "critical" -> "CRITICAL"
 */
export function formatSeverity(severity?: string | null): string {
  if (!severity) return 'UNKNOWN'
  return severity.toUpperCase()
}

/**
 * Truncates text to max length with ellipsis.
 */
export function truncateText(text?: string | null, max: number = 100): string {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '...'
}

/**
 * Generates a mock ID with a given prefix.
 * Example: generateId('inc') -> 'inc_01J9N2K4M6P8'
 */
export function generateId(prefix: string): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${prefix}_${result}`
}
