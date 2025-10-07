import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { NotificationSharedState } from '@shared/definition/mobx-shared'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response-replenish'

export class VRChatNotifications extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly notifications = ref<NotificationInformation[]>([])
  private $!: NotificationSharedState

  protected async onInit() {
    this.bindEvents()
    this.$ = this.mobx.use<NotificationSharedState>(this.moduleId)
    this.notifications.value = await this.getAllNotifications()
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-notifications:notifications:present', (_, notifications) => {
      this.notifications.value.push(...notifications)
    })

    this.ipc.listener.on('vrchat-notifications:notifications:append', (_, notification) => {
      this.notifications.value.push(notification)
    })

    this.ipc.listener.on(
      'vrchat-notifications:notifications:update',
      (_, notificationId, notification) => {
        const index = this.notifications.value.findIndex((f) => f.notificationId === notificationId)
        if (index !== -1) {
          this.notifications.value[index] = notification
        }
      }
    )

    this.ipc.listener.on('vrchat-notifications:notifications:remove', (_, notificationId) => {
      this.notifications.value = this.notifications.value.filter(
        (n) => n.notificationId !== notificationId
      )
    })

    this.ipc.listener.on('vrchat-notifications:notifications:clear', (_, version) => {
      this.notifications.value =
        version === 'all' ? [] : this.notifications.value.filter((n) => n.version !== version)
    })
  }

  public getAllNotifications() {
    return this.ipc.emitter.invoke('vrchat-notifications:get-notifications')
  }

  public markNotificationAsRead(notificationId: string) {
    return this.ipc.emitter.invoke('vrchat-notifications:mark-notification-as-read', notificationId)
  }

  public deleteNotificationV1(notificationId: string) {
    return this.ipc.emitter.invoke('vrchat-notifications:delete-notification-v1', notificationId)
  }

  public deleteNotificationV2(notificationId: string) {
    return this.ipc.emitter.invoke('vrchat-notifications:delete-notification-v2', notificationId)
  }

  public clearNotifications() {
    return this.ipc.emitter.invoke('vrchat-notifications:clear-notifications')
  }

  public respondNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    return this.ipc.emitter.invoke(
      'vrchat-notifications:respond-notification-v2',
      notificationId,
      type,
      data
    )
  }

  public get state() {
    return this.$
  }
}
