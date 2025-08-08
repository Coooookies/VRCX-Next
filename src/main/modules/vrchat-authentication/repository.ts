import { CredentialEntity } from '../database/entities/credential'
import type { Repository } from 'typeorm'
import type { Database } from '../database'
import type { AuthenticationCredentialEntity } from '@shared/types/vrchat-authentication'

export class AuthenticationRepository {
  constructor(private database: Database) {}

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
        createdAt: credential.createdAt
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
    return this.repository.delete({ userId })
  }

  public upsertCredential(entity: CredentialEntity) {
    return this.repository.upsert(entity, {
      conflictPaths: ['userId'],
      skipUpdateIfNoValuesChanged: true
    })
  }
}
