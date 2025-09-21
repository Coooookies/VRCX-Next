import si from 'systeminformation'
import { attempt } from '@shared/utils/async'
import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { MobxState } from '../mobx-state'
import { ServiceMonitorRepository } from './repository'
import { PROCESS_MONITOR_TIMER_INTERVAL, PROCESS_PATTERNS } from './constants'
import type { ProcessKeys } from './types'

export class ServiceMonitor extends Module<{
  'process:vrchat:state-change': (isRunning: boolean) => void
  'process:steamvr:state-change': (isRunning: boolean) => void
}> {
  @Dependency('MobxState') declare private mobx: MobxState

  private readonly logger = createLogger(this.moduleId)
  private repository!: ServiceMonitorRepository

  private listening = false
  private eventLoopTimer: NodeJS.Timeout | null = null
  private eventLoopHandler = async () => {
    await this.refresh()

    // Schedule next check
    if (this.listening) {
      this.eventLoopTimer = setTimeout(
        () => this.eventLoopHandler(),
        PROCESS_MONITOR_TIMER_INTERVAL
      )
    }
  }

  protected onInit(): void {
    this.repository = new ServiceMonitorRepository(this.moduleId, this.mobx)
    this.bindEvents()
  }

  protected onLoad(): void {
    this.start()
  }

  protected onDestroy(): void {
    this.stop()
  }

  private bindEvents() {
    this.on('process:vrchat:state-change', (isRunning) => {
      this.logger.info('VRChat process state changed', `isRunning: ${isRunning}`)
    })

    this.on('process:steamvr:state-change', (isRunning) => {
      this.logger.debug('SteamVR process state changed', `isRunning: ${isRunning}`)
    })
  }

  public async refresh() {
    const { success, value: processes, error } = await attempt(() => si.processes())

    // Process each tracker
    if (success) {
      for (const [key, pattern] of Object.entries(PROCESS_PATTERNS)) {
        const matchingProcesses = processes.list.filter((p) => pattern.test(p.name))
        this.updateProcessState(key as ProcessKeys, matchingProcesses)
      }
    } else {
      this.logger.error('Failed to get processes', error)
    }
  }

  private updateProcessState(
    key: ProcessKeys,
    matchingProcesses: si.Systeminformation.ProcessesProcessData[]
  ) {
    switch (key) {
      case 'vrchat': {
        const state = this.repository.vrchatState

        if (matchingProcesses.length > 0) {
          const firstProcess = matchingProcesses[0]

          if (this.repository.vrchatState.isRunning) {
            const currentProcess = matchingProcesses.find((p) => p.pid === state.pid)
            if (!currentProcess) {
              this.repository.setVRChatRuning(false)
              this.emit('process:vrchat:state-change', false)

              this.repository.setVRChatRuning(true)
              this.repository.setVRChatProcessInfo(firstProcess.pid, firstProcess.command)
              this.emit('process:vrchat:state-change', true)
            }
          } else {
            // Process started
            this.repository.setVRChatRuning(true)
            this.repository.setVRChatProcessInfo(firstProcess.pid, firstProcess.command)
            this.emit('process:vrchat:state-change', true)
          }
        } else {
          if (this.repository.vrchatState.isRunning) {
            // Process exited
            this.repository.setVRChatRuning(false)
            this.repository.setVRChatProcessInfo(null, null)
            this.emit('process:vrchat:state-change', false)
          }
        }

        break
      }
      case 'steamvr': {
        const state = this.repository.steamvrState

        if (matchingProcesses.length > 0) {
          const firstProcess = matchingProcesses[0]

          if (this.repository.steamvrState.isRunning) {
            const currentProcess = matchingProcesses.find((p) => p.pid === state.pid)
            if (!currentProcess) {
              this.repository.setSteamVRRuning(false)
              this.emit('process:steamvr:state-change', false)

              this.repository.setSteamVRRuning(true)
              this.repository.setSteamVRProcessInfo(firstProcess.pid, firstProcess.command)
              this.emit('process:steamvr:state-change', true)
            }
          } else {
            // Process started
            this.repository.setSteamVRRuning(true)
            this.repository.setSteamVRProcessInfo(firstProcess.pid, firstProcess.command)
            this.emit('process:steamvr:state-change', true)
          }
        } else {
          if (this.repository.steamvrState.isRunning) {
            // Process exited
            this.repository.setSteamVRRuning(false)
            this.repository.setSteamVRProcessInfo(null, null)
            this.emit('process:steamvr:state-change', false)
          }
        }

        break
      }
    }
  }

  private async start() {
    if (this.listening) {
      return
    }

    this.listening = true
    await this.eventLoopHandler()
  }

  private stop() {
    this.listening = false

    if (this.eventLoopTimer) {
      clearTimeout(this.eventLoopTimer)
      this.eventLoopTimer = null
    }
  }

  public get Repository() {
    return this.repository
  }
}
