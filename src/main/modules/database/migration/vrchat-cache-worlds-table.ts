import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateWorldsTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatCacheWorldsTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_cache_worlds" (
        "world_id" varchar(63) PRIMARY KEY NOT NULL,
        "world_name" text NOT NULL,
        "author_user_id" varchar(63) NOT NULL,
        "author_user_name" text NOT NULL,
        "description" text NOT NULL,
        "image_file_id" text NOT NULL,
        "image_file_version" integer NOT NULL,
        "organization" text NOT NULL,
        "release_status" varchar(31) NOT NULL,
        "updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)),
        "cache_updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`
      DROP TABLE "vrchat_cache_worlds"
    `)
  }
}
