import Nanobus from 'nanobus'

export type ExtractBusEvents<T> = T extends Nanobus<infer U> ? U : never
export type BusInstance = InstanceType<typeof Nanobus>

export abstract class Module<
  T extends ExtractBusEvents<BusInstance> = ExtractBusEvents<BusInstance>
> extends Nanobus<T> {
  private _isInitialized = false
  public readonly moduleId: string

  constructor(moduleId: string) {
    super(`eventbus:${moduleId}`)
    this.moduleId = moduleId
  }

  protected onInit?(): void
  protected onLoad?(): void
  protected onDestroy?(): void

  async _init(): Promise<void> {
    if (this._isInitialized) {
      throw new Error(`${this.constructor.name} is already initialized`)
    }
    this._isInitialized = true
    this.onInit && (await this.onInit())
  }

  _load(): void {
    this.onLoad && this.onLoad()
  }

  _destroy(): void {
    this.onDestroy && this.onDestroy()
    this.removeAllListeners()
  }
}
