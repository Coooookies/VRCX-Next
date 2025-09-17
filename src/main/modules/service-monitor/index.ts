import si from 'systeminformation'
import { attempt } from '@shared/utils/async'
import { createLogger } from '@main/logger'
import { Module } from '@shared/module-constructor'
import {
  PROCESS_MONITOR_TIMER_INTERVAL,
  PROCESS_VRCHAT_PATTERN,
  PROCESS_STEAMVR_PATTERN
} from './constants'
import type { ProcessTracker, ProcessState } from './types'

export class ServiceMonitor extends Module<{
  'process:vrchat:state-change': (state: ProcessState) => void
  'process:steamvr:state-change': (state: ProcessState) => void
}> {
  private readonly logger = createLogger(this.moduleId)
  private readonly processTrackers: Map<string, ProcessTracker> = new Map([
    [
      'vrchat',
      {
        running: false,
        processInfo: null,
        pattern: PROCESS_VRCHAT_PATTERN,
        eventName: 'process:vrchat:state-change',
        displayName: 'VRChat'
      }
    ],
    [
      'steamvr',
      {
        running: false,
        processInfo: null,
        pattern: PROCESS_STEAMVR_PATTERN,
        eventName: 'process:steamvr:state-change',
        displayName: 'SteamVR'
      }
    ]
  ])

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
    this.bindEvents()
  }

  protected onLoad(): void {
    this.start()
  }

  protected onDestroy(): void {
    this.stop()
  }

  private bindEvents() {
    this.on('process:vrchat:state-change', (state) => {
      this.logger.info(
        'VRChat process state changed',
        `isRunning: ${state.running}`,
        JSON.stringify(state)
      )
    })

    this.on('process:steamvr:state-change', (state) => {
      this.logger.debug(
        'SteamVR process state changed',
        `isRunning: ${state.running}`,
        JSON.stringify(state)
      )
    })
  }

  public async refresh() {
    const { success, value: processes, error } = await attempt(() => si.processes())

    // Process each tracker
    if (success) {
      for (const [, tracker] of this.processTrackers) {
        const matchingProcesses = processes.list.filter((p) => tracker.pattern.test(p.name))
        this.updateProcessState(tracker, matchingProcesses)
      }
    } else {
      this.logger.error('Failed to get processes', error)
    }
  }

  private handleProcessStart(
    tracker: ProcessTracker,
    process: si.Systeminformation.ProcessesProcessData
  ) {
    tracker.running = true
    tracker.processInfo = {
      pid: process.pid,
      cmd: process.command
    }
    this.emit(tracker.eventName, this.getProcessState(tracker))
  }

  private handleProcessExit(tracker: ProcessTracker) {
    tracker.running = false
    tracker.processInfo = null
    this.emit(tracker.eventName, this.getProcessState(tracker))
  }

  private updateProcessState(
    tracker: ProcessTracker,
    matchingProcesses: si.Systeminformation.ProcessesProcessData[]
  ) {
    if (matchingProcesses.length > 0) {
      if (tracker.running) {
        // Check if current process is still running
        const currentProcess = matchingProcesses.find((p) => p.pid === tracker.processInfo?.pid)
        if (!currentProcess) {
          // Current process exited, update to new process or mark as stopped
          this.handleProcessExit(tracker)
          this.handleProcessStart(tracker, matchingProcesses[0])
        }
      } else {
        // Process started
        this.handleProcessStart(tracker, matchingProcesses[0])
      }
    } else {
      if (tracker.running) {
        // Process exited
        this.handleProcessExit(tracker)
      }
    }
  }

  private getProcessState(tracker: ProcessTracker): ProcessState {
    if (tracker.running && tracker.processInfo) {
      return {
        running: true,
        processInfo: tracker.processInfo
      }
    }
    return { running: false }
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

  public get vrchatState(): ProcessState {
    return this.getProcessState(this.processTrackers.get('vrchat')!)
  }

  public get steamvrState(): ProcessState {
    return this.getProcessState(this.processTrackers.get('steamvr')!)
  }
}
