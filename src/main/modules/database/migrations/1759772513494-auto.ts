import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1759772513494 implements MigrationInterface {
    name = 'Auto1759772513494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vrchat_friend_location_activity" ("activity_id" varchar(63) PRIMARY KEY NOT NULL, "ref_user_id" varchar(63) NOT NULL, "friend_user_id" varchar(63) NOT NULL, "friend_user_name" text, "world_id" varchar(63) NOT NULL, "world_name" text, "world_version" integer, "owner_id" varchar(63), "owner_name" text, "instance_id" text NOT NULL, "instance_type" varchar(15) NOT NULL, "recorded_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)))`);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_ref_user_id" ON "vrchat_friend_location_activity" ("ref_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_instance_type" ON "vrchat_friend_location_activity" ("ref_user_id", "instance_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_owner_name" ON "vrchat_friend_location_activity" ("ref_user_id", "owner_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_world_name" ON "vrchat_friend_location_activity" ("ref_user_id", "world_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_world_id" ON "vrchat_friend_location_activity" ("ref_user_id", "world_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_friend_user_name" ON "vrchat_friend_location_activity" ("ref_user_id", "friend_user_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_friend_user_id" ON "vrchat_friend_location_activity" ("ref_user_id", "friend_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_location_activity_activity_id" ON "vrchat_friend_location_activity" ("ref_user_id", "activity_id") `);
        await queryRunner.query(`CREATE TABLE "vrchat_friend_avatar_activity" ("activity_id" varchar(63) PRIMARY KEY NOT NULL, "ref_user_id" varchar(63) NOT NULL, "friend_user_id" varchar(63) NOT NULL, "friend_user_name" text, "avatar_image_file_id" varchar(63) NOT NULL, "avatar_image_file_version" integer NOT NULL, "avatar_name" text, "recorded_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)))`);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_avatar_activity_ref_user_id" ON "vrchat_friend_avatar_activity" ("ref_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_avatar_activity_avatar_name" ON "vrchat_friend_avatar_activity" ("ref_user_id", "avatar_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_avatar_activity_friend_user_name" ON "vrchat_friend_avatar_activity" ("ref_user_id", "friend_user_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_avatar_activity_friend_user_id" ON "vrchat_friend_avatar_activity" ("ref_user_id", "friend_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_avatar_activity_activity_id" ON "vrchat_friend_avatar_activity" ("ref_user_id", "activity_id") `);
        await queryRunner.query(`CREATE TABLE "vrchat_friend_common_activity" ("activity_id" varchar(63) PRIMARY KEY NOT NULL, "ref_user_id" varchar(63) NOT NULL, "friend_user_id" varchar(63) NOT NULL, "friend_user_name" text, "activity_type" varchar(31) NOT NULL, "before_value" text NOT NULL, "after_value" text NOT NULL, "recorded_at" datetime NOT NULL DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)))`);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_ref_user_id" ON "vrchat_friend_common_activity" ("ref_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_after_value" ON "vrchat_friend_common_activity" ("ref_user_id", "after_value") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_before_value" ON "vrchat_friend_common_activity" ("ref_user_id", "before_value") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_friend_user_name" ON "vrchat_friend_common_activity" ("ref_user_id", "friend_user_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_friend_user_id" ON "vrchat_friend_common_activity" ("ref_user_id", "friend_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_activity_type" ON "vrchat_friend_common_activity" ("ref_user_id", "activity_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_friend_common_activity_activity_id" ON "vrchat_friend_common_activity" ("ref_user_id", "activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_vrchat_visited_instances_ref_user_id" ON "vrchat_visited_instances" ("ref_user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_vrchat_visited_instances_ref_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_activity_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_activity_type"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_friend_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_friend_user_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_before_value"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_after_value"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_common_activity_ref_user_id"`);
        await queryRunner.query(`DROP TABLE "vrchat_friend_common_activity"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_avatar_activity_activity_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_avatar_activity_friend_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_avatar_activity_friend_user_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_avatar_activity_avatar_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_avatar_activity_ref_user_id"`);
        await queryRunner.query(`DROP TABLE "vrchat_friend_avatar_activity"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_activity_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_friend_user_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_friend_user_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_world_id"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_world_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_owner_name"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_instance_type"`);
        await queryRunner.query(`DROP INDEX "IDX_vrchat_friend_location_activity_ref_user_id"`);
        await queryRunner.query(`DROP TABLE "vrchat_friend_location_activity"`);
    }

}
