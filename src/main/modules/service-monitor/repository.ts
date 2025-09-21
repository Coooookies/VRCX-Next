import type { MobxState } from '../mobx-state'
import type { ServiceMonitorSharedState } from '@shared/definition/mobx-shared'

export class ServiceMonitorRepository {
  private $!: ServiceMonitorSharedState

  constructor(
    moduleId: string,
    private readonly mobx: MobxState
  ) {
    this.$ = mobx.observable(
      moduleId,
      {
        vrchat: {
          isRunning: false,
          pid: null,
          cmd: null
        },
        steamvr: {
          isRunning: false,
          pid: null,
          cmd: null
        }
      },
      [
        'steamvr.isRunning',
        'vrchat.isRunning',
        'steamvr.cmd',
        'steamvr.pid',
        'vrchat.cmd',
        'vrchat.pid'
      ]
    )
  }

  public setVRChatRuning(running: boolean) {
    this.mobx.action(() => (this.$.vrchat.isRunning = running))
  }

  public setSteamVRRuning(running: boolean) {
    this.mobx.action(() => (this.$.steamvr.isRunning = running))
  }

  public setVRChatProcessInfo(pid: number | null, cmd: string | null) {
    this.mobx.action(() => {
      this.$.vrchat.pid = pid
      this.$.vrchat.cmd = cmd
    })
  }

  public setSteamVRProcessInfo(pid: number | null, cmd: string | null) {
    this.mobx.action(() => {
      this.$.steamvr.pid = pid
      this.$.steamvr.cmd = cmd
    })
  }

  public get vrchatState() {
    return this.$.vrchat
  }

  public get steamvrState() {
    return this.$.steamvr
  }
}
