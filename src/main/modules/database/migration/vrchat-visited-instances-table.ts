import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateVisitedInstanceTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatVisitedInstanceTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_visited_instances" (
        "record_id" varchar(63) PRIMARY KEY NOT NULL,
        "world_id" varchar(63) NOT NULL,
        "world_name" text,
        "world_version" integer,
        "ref_user_id" varchar(63) NOT NULL,
        "owner_id" varchar(63),
        "owner_name" text,
        "instance_id" text NOT NULL,
        "instance_type" varchar(15) NOT NULL,
        "joined_at" datetime NOT NULL,
        "left_at" datetime,
        "recorded_at" datetime NOT NULL DEFAULT (
          strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)
        )
      );
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instances_owner_id" ON "vrchat_visited_instances" ("owner_id");
    `)
    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instances_owner_name" ON "vrchat_visited_instances" ("owner_name");
    `)
    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instances_ref_user_id" ON "vrchat_visited_instances" ("ref_user_id");
    `)
    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instances_world_id" ON "vrchat_visited_instances" ("world_id");
    `)
    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instances_world_name" ON "vrchat_visited_instances" ("world_name");
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instances_owner_name"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instances_owner_id"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instances_world_name"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instances_world_id"`)
    await runner.query(`DROP TABLE "vrchat_visited_instances"`)
  }
}

export class CreateVisitedInstanceUserEventsTable1710000000001 implements MigrationInterface {
  name = 'CreateVRChatVisitedInstanceUserEventsTable1710000000001'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_visited_instance_user_events" (
        "event_id" varchar(63) PRIMARY KEY NOT NULL,
        "record_id" varchar(63) NOT NULL,
        "event_type" varchar(15) NOT NULL,
        "user_id" varchar(63) NOT NULL,
        "user_name" text NOT NULL,
        "recorded_at" datetime NOT NULL DEFAULT (
          strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)
        ),
        CONSTRAINT "FK_12f3ae6c4c662359ce2856e7b9e" FOREIGN KEY ("record_id") REFERENCES "vrchat_visited_instances" ("record_id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instance_user_events_record_id" ON "vrchat_visited_instance_user_events" ("record_id");
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instance_user_events_user_id" ON "vrchat_visited_instance_user_events" ("user_id");
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instance_user_events_user_name" ON "vrchat_visited_instance_user_events" ("user_name");
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instance_user_events_user_name"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instance_user_events_user_id"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instance_user_events_record_id"`)
    await runner.query(`DROP TABLE "vrchat_visited_instance_user_events"`)
  }
}

export class CreateVisitedInstanceCommonEventsTable1710000000002 implements MigrationInterface {
  name = 'CreateVRChatVisitedInstanceCommonEventsTable1710000000002'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_visited_instance_common_events" (
        "event_id" varchar(63) PRIMARY KEY NOT NULL,
        "record_id" varchar(63) NOT NULL,
        "event_type" varchar(15) NOT NULL,
        "keyword" text NOT NULL,
        "raw" text NOT NULL,
        "recorded_at" datetime NOT NULL DEFAULT (
          strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)
        ),
        CONSTRAINT "FK_7388acd69d3da08b8ab569194ec" FOREIGN KEY ("record_id") REFERENCES "vrchat_visited_instances" ("record_id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instance_common_events_keyword" ON "vrchat_visited_instance_common_events" ("keyword");
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_visited_instance_common_events_record_id" ON "vrchat_visited_instance_common_events" ("record_id");
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instance_common_events_keyword"`)
    await runner.query(`DROP INDEX "IDX_vrchat_visited_instance_common_events_record_id"`)
    await runner.query(`DROP TABLE "vrchat_visited_instance_common_events"`)
  }
}
