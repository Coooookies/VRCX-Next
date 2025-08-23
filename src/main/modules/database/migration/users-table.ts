import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1710000000000 implements MigrationInterface {
  name = 'CreateUsersTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" varchar(63) PRIMARY KEY NOT NULL,
        "display_name" text NOT NULL,
        "profile_icon_file_id" text NOT NULL,
        "profile_icon_file_version" integer NOT NULL,
        "trust_rank" varchar(31) NOT NULL,
        "languages" text NOT NULL,
        "is_supporter" boolean NOT NULL,
        "cache_updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "users"
    `)
  }
}
