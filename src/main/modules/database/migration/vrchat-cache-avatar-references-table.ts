import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAvatarReferencesTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatCacheAvatarReferencesTable1720000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_cache_avatar_references" (
        "file_id" varchar(63) PRIMARY KEY NOT NULL,
        "avatar_name" text NOT NULL,
        "author_user_id" varchar(63) NOT NULL,
        "cache_updated_at" datetime NOT NULL DEFAULT (
          strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)
        )
      );
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_cache_avatar_references_author_user_id" ON "vrchat_cache_avatar_references" ("author_user_id") ;
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "IDX_vrchat_cache_avatar_references_author_user_id"`)
    await runner.query(`DROP TABLE "vrchat_cache_avatar_references"`)
  }
}
