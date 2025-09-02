import { CredentialEntity } from '../database/entities/credential'
import type { Repository } from 'typeorm'
import type { Database } from '../database'
import type { MobxState } from '../mobx-state'
import type {
  AuthenticationCredentialEntity,
  AuthenticationState
} from '@shared/definition/vrchat-authentication'
import type { AuthenticationSharedState } from '@shared/definition/mobx-shared'
import type { VRChatAuthentication } from '.'

export class AuthenticationRepository {
  private $!: AuthenticationSharedState

  constructor(
    self: VRChatAuthentication,
    private readonly mobx: MobxState,
    private readonly database: Database
  ) {
    this.$ = mobx.observable(
      self.moduleId,
      {
        state: self.currentState
      },
      ['state']
    )
  }

  public get repository(): Repository<CredentialEntity> {
    return this.database.source.getRepository(CredentialEntity)
  }

  public getAllCredentials(): Promise<AuthenticationCredentialEntity[]> {
    return this.repository.find().then((credentials) =>
      credentials.map((credential) => ({
        userId: credential.userId,
        userName: credential.userName,
        displayName: credential.displayName,
        profileIconFileId: credential.profileIconFileId,
        profileIconFileVersion: credential.profileIconFileVersion,
        updatedAt: credential.updatedAt!
      }))
    )
  }

  public getCredentialByUserId(userId: string): Promise<CredentialEntity | null> {
    return this.repository.findOneBy({ userId })
  }

  public getCredentialByUserName(userName: string): Promise<CredentialEntity | null> {
    return this.repository.findOneBy({ userName })
  }

  public deleteCredentialByUserId(userId: string) {
    return this.repository.delete({ userId }).then(() => {})
  }

  public setState(state: AuthenticationState) {
    this.mobx.action(() => {
      this.$.state = state
    })
  }

  public upsertCredential(entity: CredentialEntity) {
    const option = {
      conflictPaths: ['userId'],
      skipUpdateIfNoValuesChanged: true
    }

    return this.repository.upsert(entity, option).then(() => {})
  }
}
