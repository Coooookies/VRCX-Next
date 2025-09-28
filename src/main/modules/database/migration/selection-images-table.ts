import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateImageSelectionTable1710000000000 implements MigrationInterface {
  name = 'CreateImageSelectionTable1710000000000'

  public async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE "selection_images" (
        "selection_id" varchar(63) PRIMARY KEY NOT NULL,
        "file_name" text NOT NULL,
        "file_extension" text NOT NULL,
        "path" text NOT NULL,
        "macos_bookmark" text NULL,
        "recorded_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3))
      );
    `)
  }

  public async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE "image_selection"`)
  }
}
