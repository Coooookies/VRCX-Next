import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('credentials')
export class CredentialEntity {
  @PrimaryColumn({
    name: 'user_id',
    type: 'varchar',
    length: 63
  })
  declare userId: string

  @Column({
    name: 'user_name',
    type: 'text'
  })
  declare userName: string

  @Column({
    name: 'display_name',
    type: 'text'
  })
  declare displayName: string

  @Column({
    name: 'profile_icon_file_id',
    type: 'text'
  })
  declare profileIconFileId: string

  @Column({
    name: 'profile_icon_file_version',
    type: 'integer'
  })
  declare profileIconFileVersion: number

  @Column({
    name: 'token',
    type: 'varchar',
    length: 127
  })
  declare token: string

  @Column({
    name: 'two_factor_token',
    type: 'text'
  })
  declare twoFactorToken: string

  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare updatedAt?: Date
}
