import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAnalysisFilesTable1720000000000 implements MigrationInterface {
  name = 'CreateAnalysisFilesTable1720000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "analysis_files" (
        "file_id" varchar(63) NOT NULL,
        "file_version" integer NOT NULL,
        "file_size" integer NOT NULL,
        "file_uncompressed_size" integer NOT NULL,
        "type" varchar(15) NOT NULL,
        "stats" text NOT NULL,
        "cache_updated_at" datetime DEFAULT (strftime('%s', 'now') || substr(strftime('%f', 'now'), 4, 3)),
        PRIMARY KEY ("file_id", "file_version")
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "analysis_files"`)
  }
}
