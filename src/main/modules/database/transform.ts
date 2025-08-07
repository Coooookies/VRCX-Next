import type { PropertyType } from './types'

export const datetimeTransformer = {
  transformer: {
    from: (value: number | undefined) => (value ? new Date(value) : undefined),
    to: (value?: Date) => (value instanceof Date ? value.getTime() : undefined)
  }
}

export const datetimeDefault = {
  default: () => "strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)"
}

export const propertyTransformer = {
  transformer: {
    from: (value: string): PropertyType => JSON.parse(value),
    to: (value: PropertyType): string => JSON.stringify(value)
  }
}
