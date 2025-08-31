import type { MobxState } from '../mobx-state'
import type { MiscellaneousSharedState } from '@shared/definition/mobx-shared'

export class MiscellaneousRepository {
  private $!: MiscellaneousSharedState

  constructor(
    moduleId: string,
    private readonly mobx: MobxState
  ) {
    this.$ = mobx.observable(
      moduleId,
      {
        serverTimeOffset: 0
      },
      ['serverTimeOffset']
    )
  }

  public get State(): MiscellaneousSharedState {
    return this.$
  }

  public setServerTimeOffset(offset: number): void {
    this.mobx.action(() => {
      this.$.serverTimeOffset = offset
    })
  }
}
