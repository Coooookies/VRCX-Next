import { parseOwnerIdfromLocationInstance } from './factory'
import {
  VisitedInstanceCommonEventEntity,
  VisitedInstanceEntity,
  VisitedInstanceUserEventEntity
} from '../database/entities/vrchat-visited-instance'
import type { InstanceTracker } from './instance-tracker'
import type { InstanceRepository } from './repository'
import { InstanceAccessCategory, InstanceEvents } from '@shared/definition/vrchat-instances'

export class InstanceEventBinding {
  constructor(
    private readonly repository: InstanceRepository,
    private readonly tracker: InstanceTracker
  ) {
    this.bindEvents()
  }

  private bindEvents() {
    this.tracker.on('instance:joined', (recordId, location, joinedAt) => {
      const refUserId = this.tracker.currentUserId || ''
      const ownerId = parseOwnerIdfromLocationInstance(location) || ''
      const [, instanceId] = location.location.split(':')

      const entity = new VisitedInstanceEntity()
      entity.recordId = recordId
      entity.joinedAt = joinedAt
      entity.recordedAt = joinedAt
      entity.worldId = location.worldId
      entity.ownerId = ownerId
      entity.refUserId = refUserId
      entity.instanceId = instanceId
      entity.instanceType = location.type
      this.repository.upsertVisitedInstanceRecord(entity)
    })

    this.tracker.on('instance:initialization-complete', (recordId, _, world, owner) => {
      const worldName = world ? world.worldName : ''
      const worldVersion = world ? world.version : 0
      let ownerName: string

      switch (owner?.type) {
        case InstanceAccessCategory.Friend:
          ownerName = owner.summary?.displayName || ''
          break
        case InstanceAccessCategory.Group:
          ownerName = owner.summary?.groupName || ''
          break
        default:
          ownerName = ''
          break
      }

      this.repository.updateVisitedInstanceRecord(recordId, {
        worldName,
        worldVersion,
        ownerName
      })
    })

    this.tracker.on('instance:left', (recordId, leftAt) => {
      this.repository.updateVisitedInstanceRecord(recordId, {
        leftAt
      })
    })

    this.tracker.on('instance:event', (recordId, events) => {
      const userEventEntities: VisitedInstanceUserEventEntity[] = []
      const commonEventEntities: VisitedInstanceCommonEventEntity[] = []

      for (const event of events) {
        switch (event.type) {
          case InstanceEvents.UserJoin:
          case InstanceEvents.UserLeave:
          case InstanceEvents.UserPresent:
          case InstanceEvents.UserRemain: {
            const entity = new VisitedInstanceUserEventEntity()
            entity.eventId = event.eventId
            entity.recordId = recordId
            entity.eventType = event.type
            entity.userId = event.content.userId
            entity.userName = event.content.userName
            entity.recordedAt = event.recordedAt
            userEventEntities.push(entity)
            break
          }
          case InstanceEvents.VoteKick: {
            const entity = new VisitedInstanceCommonEventEntity()
            entity.eventId = event.eventId
            entity.recordId = recordId
            entity.eventType = event.type
            entity.keyword = event.content.userName
            entity.raw = event.content
            entity.recordedAt = event.recordedAt
            commonEventEntities.push(entity)
            break
          }
          case InstanceEvents.VideoPlaybackLoad: {
            const entity = new VisitedInstanceCommonEventEntity()
            entity.eventId = event.eventId
            entity.recordId = recordId
            entity.eventType = event.type
            entity.keyword = event.content.url
            entity.raw = event.content
            entity.recordedAt = event.recordedAt
            commonEventEntities.push(entity)
            break
          }
          case InstanceEvents.VideoPlaybackError: {
            const entity = new VisitedInstanceCommonEventEntity()
            entity.eventId = event.eventId
            entity.recordId = recordId
            entity.eventType = event.type
            entity.keyword = event.content.reason
            entity.raw = event.content
            entity.recordedAt = event.recordedAt
            commonEventEntities.push(entity)
            break
          }
        }
      }

      if (userEventEntities.length > 0) {
        this.repository.upsertVisitedInstanceUserEvent(userEventEntities)
      }

      if (commonEventEntities.length > 0) {
        this.repository.upsertVisitedInstanceCommonEvent(commonEventEntities)
      }
    })
  }
}
