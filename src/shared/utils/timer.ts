type SchedulerTaskCallback = () => void | Promise<void>

type SchedulerTaskOptions = {
  awaitCallback?: boolean
  immediate?: boolean
}

export class Scheduler {
  private tasks = new Map<symbol, NodeJS.Timeout>()
  private runningFlags = new WeakMap<symbol, boolean>()

  addTask(
    callback: SchedulerTaskCallback,
    interval: number,
    options: SchedulerTaskOptions = {}
  ): symbol {
    const { awaitCallback = true, immediate = false } = options

    const id = Symbol('task')
    const run = async () => {
      if (this.runningFlags.get(id)) return
      this.runningFlags.set(id, true)
      try {
        if (awaitCallback) {
          await callback()
        } else {
          callback()
        }
      } finally {
        this.runningFlags.set(id, false)
      }
    }

    if (immediate) run()
    const timer = setInterval(run, interval)
    this.tasks.set(id, timer)
    return id
  }

  removeTask(id: symbol): boolean {
    const timer = this.tasks.get(id)
    if (!timer) return false
    clearInterval(timer)
    this.tasks.delete(id)
    this.runningFlags.delete(id)
    return true
  }

  clearAll(): void {
    for (const timer of this.tasks.values()) {
      clearInterval(timer)
    }
    this.tasks.clear()
    this.runningFlags = new WeakMap()
  }
}
