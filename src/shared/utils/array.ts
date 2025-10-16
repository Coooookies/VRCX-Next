export function insertIf<T extends string>(
  condition: boolean | undefined,
  ...items: [T, ...T[]]
): T[] {
  return condition ? items : []
}

export function mergeArrayMaps<T, K>(...maps: Map<T, K[]>[]): Map<T, K[]> {
  const result = new Map<T, K[]>()

  for (const map of maps) {
    for (const [key, values] of map) {
      if (result.has(key)) {
        const merged = new Set([...result.get(key)!, ...values])
        result.set(key, Array.from(merged))
      } else {
        result.set(key, [...values])
      }
    }
  }

  return result
}
