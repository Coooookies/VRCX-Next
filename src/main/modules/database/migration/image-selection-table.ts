import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateImageSelectionTable1710000000000 implements MigrationInterface {
  name = 'CreateImageSelectionTable1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "image_selection" (
        "selection_id" varchar(63) PRIMARY KEY NOT NULL,
        "file_name" text NOT NULL,
        "path" text NOT NULL,
        "macos_bookmark" text NULL,
        "recorded_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "image_selection"`)
  }
}
