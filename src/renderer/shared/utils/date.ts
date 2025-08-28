export type RelativeUnit = 'minute' | 'hour' | 'day' | 'month' | 'year'

export function formatRelativeTime(
  fromTime: Date | string | number,
  toTime: Date | string | number = new Date()
): {
  value: number
  past: boolean
  unit: RelativeUnit
} {
  const from = new Date(fromTime)
  const to = new Date(toTime)

  const diffMs = to.getTime() - from.getTime()
  const absDiffMs = Math.abs(diffMs)

  const seconds = Math.floor(absDiffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const isPast = diffMs > 0

  if (minutes < 1) {
    return { value: 0, past: isPast, unit: 'minute' }
  }

  let value: number
  let unit: RelativeUnit

  if (years >= 1) {
    value = years
    unit = 'year'
  } else if (months >= 1) {
    value = months
    unit = 'month'
  } else if (days >= 1) {
    value = days
    unit = 'day'
  } else if (hours >= 1) {
    value = hours
    unit = 'hour'
  } else {
    value = minutes
    unit = 'minute'
  }

  return { value, past: isPast, unit }
}
