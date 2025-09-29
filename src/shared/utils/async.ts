export type LimitedPromiseSettledResult<T> = PromiseSettledResult<Awaited<T>>
export type AttemptSettledResult<T, K = unknown> =
  | { success: true; value: T; error: null }
  | { success: false; value: null; error: K }

export function attempt<T, K = unknown>(c: () => Promise<T>): Promise<AttemptSettledResult<T, K>>
export function attempt<T, K = unknown>(c: () => T): AttemptSettledResult<T, K>
export function attempt<T, K = unknown>(
  c: () => T | Promise<T>
): AttemptSettledResult<T, K> | Promise<AttemptSettledResult<T, K>> {
  try {
    const result = c()
    if (result instanceof Promise) {
      return result
        .then((value) => ({ success: true, value, error: null }) as const)
        .catch((error: K) => ({ success: false, value: null, error }) as const)
    } else {
      return {
        success: true,
        value: result,
        error: null
      }
    }
  } catch (error) {
    return {
      success: false,
      value: null,
      error: error as K
    }
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

export class RequestQueue {
  private queue: Array<() => void> = []
  private running = 0
  private readonly concurrency: number

  constructor(concurrency: number) {
    this.concurrency = Math.max(1, Math.floor(concurrency))
  }

  public add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const runner = () => {
        this.running++
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--
            this.runNext()
          })
      }

      if (this.running < this.concurrency) {
        runner()
      } else {
        this.queue.push(runner)
      }
    })
  }

  private runNext(): void {
    if (this.running >= this.concurrency) return
    const next = this.queue.shift()
    if (next) {
      next()
    }
  }
}
