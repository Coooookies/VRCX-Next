import { Entity, Column, PrimaryColumn } from 'typeorm'
import { datetimeDefault, datetimeTransformer } from '../transform'

@Entity('credentials')
export class CredentialEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 63
  })
  declare user_id: string

  @Column({ type: 'text' })
  declare user_name: string

  @Column({ type: 'text' })
  declare display_name: string

  @Column({ type: 'text' })
  declare profile_icon_file_id: string

  @Column({ type: 'integer' })
  declare profile_icon_file_version: number

  @Column({
    type: 'varchar',
    length: 127
  })
  declare token: string

  @Column({ type: 'text' })
  declare two_factor_token: string

  @Column({
    type: 'datetime',
    nullable: true,
    ...datetimeTransformer,
    ...datetimeDefault
  })
  declare created_at: Date
}
