import { union, isEqual } from 'lodash'

export interface DiffResult<T = unknown> {
  keys: (keyof T)[]
  diff: {
    before: Partial<T>
    after: Partial<T>
  }
}

export function diffObjects<T extends object>(
  objA: T,
  objB: T,
  whitelistKeys?: (keyof T)[]
): DiffResult<T> {
  const result: DiffResult<T> = {
    keys: [],
    diff: {
      before: {},
      after: {}
    }
  }

  const keysToCompare =
    whitelistKeys && whitelistKeys.length > 0
      ? whitelistKeys.map((key) => String(key))
      : union(Object.keys(objA), Object.keys(objB))

  for (const key of keysToCompare) {
    const valueA = objA[key]
    const valueB = objB[key]

    if (!isEqual(valueA, valueB)) {
      result.diff.before[key as keyof T] = valueA
      result.diff.after[key as keyof T] = valueB
      result.keys.push(key as keyof T)
    }
  }
  return result
}
