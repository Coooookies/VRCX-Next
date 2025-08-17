import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateGroupsTable1710000000000 implements MigrationInterface {
  name = 'CreateGroupsTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "groups" (
        "group_id" varchar(63) PRIMARY KEY NOT NULL,
        "group_name" text NOT NULL,
        "short_code" text NOT NULL,
        "description" text NOT NULL,
        "icon_file_id" text NOT NULL,
        "icon_file_version" integer NOT NULL,
        "banner_file_id" text NOT NULL,
        "banner_file_version" integer NOT NULL,
        "owner_id" varchar(63) NOT NULL,
        "is_verified" boolean NOT NULL,
        "cache_updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "groups"
    `)
  }
}
