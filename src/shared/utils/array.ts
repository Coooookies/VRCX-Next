export function insertIf<T extends string>(
  condition: boolean | undefined,
  ...items: [T, ...T[]]
): T[] {
  return condition ? items : []
}
