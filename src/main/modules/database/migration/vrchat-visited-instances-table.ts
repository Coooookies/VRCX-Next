import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateVisitedInstanceTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatVisitedInstanceTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_visited_instances" (
        "record_id" varchar(127) NOT NULL,
        "world_id" varchar(63) NOT NULL,
        "world_name" text NOT NULL,
        "owner_id" varchar(63) NULL,
        "owner_name" text NULL,
        "instance_id" text NOT NULL,
        "instance_type" varchar(15) NOT NULL,
        "joined_at" datetime NOT NULL,
        "left_at" datetime NOT NULL,
        "recorded_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)

    await runner.query(`CREATE INDEX idx_world_id ON vrchat_visited_instances(world_id);`)
    await runner.query(`CREATE INDEX idx_owner_id ON vrchat_visited_instances(owner_id);`)
    await runner.query(`CREATE INDEX idx_joined_at ON vrchat_visited_instances(joined_at);`)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX idx_joined_at`)
    await runner.query(`DROP INDEX idx_owner_id`)
    await runner.query(`DROP INDEX idx_world_id`)
    await runner.query(`DROP TABLE "vrchat_visited_instances"`)
  }
}
