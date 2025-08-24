import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateNotificationTable1710000000000 implements MigrationInterface {
  name = 'CreateNotificationTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "notification_id" varchar(63) PRIMARY KEY NOT NULL,
        "type" varchar(63) NOT NULL,
        "sender_id" varchar(63) NOT NULL,
        "sender_type" varchar(31) NOT NULL,
        "owner_user_id" varchar(63) NOT NULL,
        "title" text NOT NULL,
        "message" text NOT NULL,
        "raw_notification" text NOT NULL,
        "create_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "notifications"
    `)
  }
}
