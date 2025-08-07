import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCredentialsTable1710000000000 implements MigrationInterface {
  name = 'CreateCredentialsTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "credentials" (
        "user_id" varchar(63) NOT NULL,
        "user_name" text NOT NULL,
        "display_name" text NOT NULL,
        "profile_icon_file_id" text NOT NULL,
        "profile_icon_file_version" integer NOT NULL,
        "token" varchar(127) NOT NULL,
        "two_factor_token" text NOT NULL,
        "created_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)),
        PRIMARY KEY ("user_id")
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "credentials"
    `)
  }
}
