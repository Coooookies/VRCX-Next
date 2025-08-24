// https://github.com/LunyaaDev/vrchat-location-parser/blob/main/src/formatInstanceId.ts

import { LocationInstance } from '@shared/definition/vrchat-instances'

export const formatInstanceId = (instance: LocationInstance) => {
  let instanceId = instance.name

  // hidden(usr_00000000-0000-0000-0000-000000000000)
  if (instance.type == 'friends+') {
    instanceId += `~hidden(${instance.userId})`
  }

  // friends(usr_00000000-0000-0000-0000-000000000000)
  else if (instance.type == 'friends') {
    instanceId += `~friends(${instance.userId})`
  }

  // private(usr_00000000-0000-0000-0000-000000000000)
  else if (instance.type == 'invite+') {
    instanceId += `~private(${instance.userId})~canRequestInvite`
  }

  // private(usr_00000000-0000-0000-0000-000000000000)~canRequestInvite
  else if (instance.type == 'invite') {
    instanceId += `~private(${instance.userId})`
  }

  // group(grp_00000000-0000-0000-0000-000000000000)
  else if (
    instance.type == 'group' ||
    instance.type == 'groupPublic' ||
    instance.type == 'group+'
  ) {
    instanceId += `~group(${instance.groupId})`

    if (instance.type == 'groupPublic') {
      instanceId += '~groupAccessType(public)'
    } else if (instance.type == 'group+') {
      instanceId += '~groupAccessType(plus)'
    } else {
      instanceId += '~groupAccessType(members)'
    }

    if (instance.require18yo) {
      instanceId += '~ageGate'
    }
  }

  if (instance.region) {
    instanceId += `~region(${instance.region})`
  }

  return instanceId
}

export const formatLocation = (instance: LocationInstance) => {
  return `${instance.worldId}:${formatInstanceId(instance)}`
}
