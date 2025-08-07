export type LimitedPromiseSettledResult<T> = PromiseSettledResult<Awaited<T>>
export type AttemptSettledResult<T> =
  | { success: true; value: T; error: null }
  | { success: false; value: null; error: unknown }

export function attempt<T>(callback: () => Promise<T>): Promise<AttemptSettledResult<T>>
export function attempt<T>(callback: () => T): AttemptSettledResult<T>
export function attempt<T>(
  callback: () => T | Promise<T>
): AttemptSettledResult<T> | Promise<AttemptSettledResult<T>> {
  try {
    const result = callback()
    if (result instanceof Promise) {
      return result
        .then((value) => ({ success: true, value, error: null }) as const)
        .catch((error: unknown) => ({ success: false, value: null, error }) as const)
    } else {
      return { success: true, value: result, error: null }
    }
  } catch (error) {
    return { success: false, value: null, error }
  }
}

export async function limitedAllSettled<T extends readonly (() => Promise<unknown>)[]>(
  promiseFactories: T,
  limit: number,
  progressCallback?: (totalCount: number, completedCount: number) => void
): Promise<{ [K in keyof T]: LimitedPromiseSettledResult<ReturnType<T[K]>> }> {
  const allLength = promiseFactories.length
  const results: Partial<LimitedPromiseSettledResult<unknown>[]> = new Array(allLength)

  let nextIndex = 0
  let doneIndex = 0

  async function worker(): Promise<void> {
    while (true) {
      const currentIndex = nextIndex++
      if (currentIndex >= promiseFactories.length) {
        break
      }

      try {
        const value = await promiseFactories[currentIndex]()
        results[currentIndex] = { status: 'fulfilled', value }
      } catch (reason) {
        results[currentIndex] = { status: 'rejected', reason }
      }

      if (progressCallback) {
        progressCallback(allLength, ++doneIndex)
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, promiseFactories.length) }, () => worker())
  await Promise.all(workers)

  return results as {
    [K in keyof T]: LimitedPromiseSettledResult<ReturnType<T[K]>>
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
