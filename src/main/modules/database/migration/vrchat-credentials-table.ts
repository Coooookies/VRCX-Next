import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCredentialsTable1710000000000 implements MigrationInterface {
  name = 'CreateVRChatCredentialsTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "vrchat_credentials" (
        "user_id" varchar(63) NOT NULL,
        "user_name" text NOT NULL,
        "display_name" text NOT NULL,
        "profile_icon_file_id" text NOT NULL,
        "profile_icon_file_version" integer NOT NULL,
        "token" varchar(127) NOT NULL,
        "two_factor_token" text NOT NULL,
        "updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)),
        PRIMARY KEY ("user_id")
      );
    `)

    await runner.query(`
      CREATE INDEX "idx_vrchat_credentials_user_name" ON "vrchat_credentials" ("user_name");
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP INDEX "idx_vrchat_credentials_user_name"`)
    await runner.query(`DROP TABLE "vrchat_credentials"`)
  }
}
