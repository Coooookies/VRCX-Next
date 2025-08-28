import { formatRelativeTime } from '@renderer/shared/utils/date'
import type { TranslationFunction } from '@renderer/shared/locale'
import type { LocaleI18NKeys } from '@renderer/shared/locale/types'

export function generateElapsedTime(startTime: number, currentTime: number): string {
  const elapsed = Math.max(0, currentTime - startTime)
  const hours = Math.floor(elapsed / (1000 * 60 * 60))
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export function generateRelativeTime(
  startTime: number,
  currentTime: number
): (t: TranslationFunction) => string {
  const { value, past, unit } = formatRelativeTime(startTime, currentTime)
  let i18nKey: LocaleI18NKeys

  switch (unit) {
    case 'minute': {
      if (value === 0) {
        i18nKey = past ? 'date.just_now' : 'date.just_now_future'
      } else {
        i18nKey =
          value === 1
            ? past
              ? 'date.minute_ago'
              : 'date.in_minute'
            : past
              ? 'date.minutes_ago'
              : 'date.in_minutes'
      }
      break
    }
    case 'hour': {
      i18nKey =
        value === 1
          ? past
            ? 'date.hour_ago'
            : 'date.in_hour'
          : past
            ? 'date.hours_ago'
            : 'date.in_hours'
      break
    }
    case 'day': {
      if (value === 1) {
        i18nKey = past ? 'date.yesterday' : 'date.tomorrow'
      } else {
        i18nKey = past ? 'date.days_ago' : 'date.in_days'
      }
      break
    }
    case 'month': {
      i18nKey =
        value === 1
          ? past
            ? 'date.one_month_ago'
            : 'date.in_one_month'
          : past
            ? 'date.months_ago'
            : 'date.in_months'
      break
    }
    case 'year': {
      i18nKey =
        value === 1
          ? past
            ? 'date.one_year_ago'
            : 'date.in_one_year'
          : past
            ? 'date.years_ago'
            : 'date.in_years'
      break
    }
  }

  return (t) => t(i18nKey, { value })
}
