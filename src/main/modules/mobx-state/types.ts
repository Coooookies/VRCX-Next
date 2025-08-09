type Join<K, P, T extends number | string = string> = K extends T
  ? P extends T
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

export type TargetPaths<T, D extends number = 3, TK extends number | string = string> = [
  D
] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends TK ? `${K}` | Join<K, TargetPaths<T[K], Previous[D]>> : never
      }[keyof T]
    : ''

export interface RegisteredTargetInstance {
  target: object
}
