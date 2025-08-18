import { isEqual } from 'lodash'

export function diffSurface<T extends object>(a: T, b: T): Partial<T> {
  const diff: Partial<T> = {}
  for (const key in b) {
    if (!isEqual(a[key], b[key])) {
      diff[key] = b[key]
    }
  }
  return diff
}
