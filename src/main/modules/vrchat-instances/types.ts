import type {
  InstanceUserActivitySummary,
  InstanceUserSummary
} from '@shared/definition/vrchat-instances'

export type InstancePresentProcessHandler = (
  users: InstanceUserSummary[],
  activities: InstanceUserActivitySummary[]
) => void
