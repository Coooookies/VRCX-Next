import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateNotificationTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatNotificationTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_notifications" (
        "notification_id" varchar(63) NOT NULL,
        "owner_user_id" varchar(63) NOT NULL,
        "type" varchar(63) NOT NULL,
        "title" text NOT NULL,
        "message" text NOT NULL,
        "is_read" boolean NOT NULL,
        "thumbnail_image_url" text,
        "sender_id" varchar(63),
        "sender_type" varchar(31) NOT NULL,
        "version" varchar(15) NOT NULL,
        "raw" text NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (
          strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)
        ),
        PRIMARY KEY ("notification_id", "owner_user_id")
      );
    `)

    await runner.query(`
      CREATE INDEX "IDX_vrchat_notifications_owner_user_id" ON "vrchat_notifications" ("owner_user_id");
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "IDX_vrchat_notifications_owner_user_id"`)
    await runner.query(`DROP TABLE "vrchat_notifications"`)
  }
}
