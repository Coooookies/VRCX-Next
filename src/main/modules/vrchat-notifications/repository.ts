import { toNotificationEntity } from './factory'
import { NotificationEntity } from '../database/entities/vrchat-notifications'
import type { Repository } from 'typeorm'
import type { Database } from '../database'
import type { MobxState } from '../mobx-state'
import type { NotificationSharedState } from '@shared/definition/mobx-shared'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'

export class NotificationRepository {
  private $!: NotificationSharedState

  constructor(
    moduleId: string,
    private readonly mobx: MobxState,
    private readonly database: Database
  ) {
    this.$ = this.mobx.observable(
      moduleId,
      {
        loading: false
      },
      ['loading']
    )
  }

  private get repository(): Repository<NotificationEntity> {
    return this.database.source.getRepository(NotificationEntity)
  }

  private upsertNotifications(entities: NotificationEntity | NotificationEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['notificationId', 'refUserId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async saveNotification(
    notification: NotificationInformation | NotificationInformation[],
    refUserId: string
  ) {
    const pendingNotifications = Array.isArray(notification) ? notification : [notification]
    const pendingEntities = pendingNotifications.map((n) => toNotificationEntity(n, refUserId))
    await this.upsertNotifications(pendingEntities)
  }

  public setLoadingState(loading: boolean) {
    this.mobx.action(() => {
      this.$.loading = loading
    })
  }

  public get State(): NotificationSharedState {
    return this.$
  }
}
