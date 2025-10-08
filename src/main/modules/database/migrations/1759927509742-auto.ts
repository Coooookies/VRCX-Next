import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1759927509742 implements MigrationInterface {
    name = 'Auto1759927509742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_vrchat_cache_worlds_world_name"`);
        await queryRunner.query(`CREATE TABLE "temporary_vrchat_cache_worlds" ("world_id" varchar(63) PRIMARY KEY NOT NULL, "world_name" text NOT NULL, "author_user_id" varchar(63) NOT NULL, "author_user_name" text NOT NULL, "description" text NOT NULL, "image_file_id" text NOT NULL, "image_file_version" integer NOT NULL, "organization" text NOT NULL, "release_status" varchar(31) NOT NULL, "updated_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)), "cache_updated_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)), "version" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_vrchat_cache_worlds"("world_id", "world_name", "author_user_id", "author_user_name", "description", "image_file_id", "image_file_version", "organization", "release_status", "updated_at", "cache_updated_at") SELECT "world_id", "world_name", "author_user_id", "author_user_name", "description", "image_file_id", "image_file_version", "organization", "release_status", "updated_at", "cache_updated_at" FROM "vrchat_cache_worlds"`);
        await queryRunner.query(`DROP TABLE "vrchat_cache_worlds"`);
        await queryRunner.query(`ALTER TABLE "temporary_vrchat_cache_worlds" RENAME TO "vrchat_cache_worlds"`);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_cache_worlds_world_name" ON "vrchat_cache_worlds" ("world_name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_vrchat_cache_worlds_world_name"`);
        await queryRunner.query(`ALTER TABLE "vrchat_cache_worlds" RENAME TO "temporary_vrchat_cache_worlds"`);
        await queryRunner.query(`CREATE TABLE "vrchat_cache_worlds" ("world_id" varchar(63) PRIMARY KEY NOT NULL, "world_name" text NOT NULL, "author_user_id" varchar(63) NOT NULL, "author_user_name" text NOT NULL, "description" text NOT NULL, "image_file_id" text NOT NULL, "image_file_version" integer NOT NULL, "organization" text NOT NULL, "release_status" varchar(31) NOT NULL, "updated_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)), "cache_updated_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)))`);
        await queryRunner.query(`INSERT INTO "vrchat_cache_worlds"("world_id", "world_name", "author_user_id", "author_user_name", "description", "image_file_id", "image_file_version", "organization", "release_status", "updated_at", "cache_updated_at") SELECT "world_id", "world_name", "author_user_id", "author_user_name", "description", "image_file_id", "image_file_version", "organization", "release_status", "updated_at", "cache_updated_at" FROM "temporary_vrchat_cache_worlds"`);
        await queryRunner.query(`DROP TABLE "temporary_vrchat_cache_worlds"`);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_cache_worlds_world_name" ON "vrchat_cache_worlds" ("world_name") `);
    }

}
